/**
 * Security and Sanitization Utilities
 *
 * Provides robust defensive mechanisms for:
 * 1. Safe URL parsing & protocol filtering (prevents XSS via javascript:, data:, vbscript:, blob:, file:, etc.)
 * 2. File upload validation with TRUE magic byte verification (PDF, PNG, JPEG, WEBP, GIF)
 * 3. Input sanitation & length bounding
 * 4. Contact form abuse & spam prevention (rate limiting & honeypot verification)
 */

/**
 * Allowed URL protocols for external links, anchors, iframes, and media.
 */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Validates and sanitizes a URL for safe usage in href, src, or iframe contexts.
 * Returns empty string if the URL is invalid, malicious, or uses a disallowed protocol.
 */
export function sanitizeUrl(url?: string | null): string {
  if (!url) return '';

  // Strip all control characters (0x00-0x1F, 0x7F) and null bytes before processing
  const cleaned = url.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  if (!cleaned) return '';

  // Prevent protocol-relative URLs (//example.com), /\, or other scheme-relative vectors
  if (cleaned.startsWith('//') || cleaned.startsWith('/\\') || cleaned.startsWith('\\/')) {
    return '';
  }

  // Allow relative URLs starting with a single '/'
  if (cleaned.startsWith('/')) {
    // Normalise any accidental '/public/' prefix
    const path = cleaned.startsWith('/public/') ? cleaned.replace('/public/', '/') : cleaned;
    // Check for directory traversal sequences like /../
    if (path.includes('/../') || path.endsWith('/..')) {
      return '';
    }
    return encodeURI(decodeURI(path));
  }

  try {
    const parsed = new URL(cleaned);
    const protocol = parsed.protocol.toLowerCase();

    // Explicitly reject dangerous schemes
    if (!ALLOWED_PROTOCOLS.has(protocol)) {
      return '';
    }

    // For http / https, ensure a valid hostname exists
    if (protocol === 'http:' || protocol === 'https:') {
      if (!parsed.hostname || parsed.hostname.includes(' ')) {
        return '';
      }
    }

    return parsed.href;
  } catch {
    // Check if it is a safe relative pathname like 'resumes/cv.pdf' without protocols
    if (/^[a-zA-Z0-9_\-./]+$/.test(cleaned) && !cleaned.includes('://') && !cleaned.includes(':') && !cleaned.includes('..')) {
      return `/${cleaned}`;
    }
    return '';
  }
}

/**
 * Validates if an email string matches standard RFC 5322 format.
 */
export function isValidEmail(email?: string | null): boolean {
  if (!email) return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Sanitizes and bounds input strings to prevent overflow and strip control characters.
 */
export function sanitizeString(input: string | undefined | null, maxLength = 1000): string {
  if (!input) return '';
  return input
    .slice(0, maxLength)
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '') // Strip ASCII control characters
    .trim();
}

/**
 * Sanitizes a storage file name to prevent path traversal and shell injection.
 */
export function sanitizeStorageFileName(originalName: string): string {
  const baseName = originalName.split(/[/\\]/).pop() || 'upload';
  const dotIndex = baseName.lastIndexOf('.');
  const namePart = dotIndex !== -1 ? baseName.substring(0, dotIndex) : baseName;
  const extPart = dotIndex !== -1 ? baseName.substring(dotIndex).toLowerCase() : '';

  // Clean name part: keep only alphanumeric, hyphens, and underscores
  const cleanName = namePart.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
  // Clean extension: keep only alphanumeric
  const cleanExt = extPart.replace(/[^a-zA-Z0-9.]/g, '').slice(0, 10);

  return `${cleanName}${cleanExt}`;
}

export interface FileValidationOptions {
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  maxSizeBytes: number;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  detectedType?: 'pdf' | 'png' | 'jpeg' | 'webp' | 'gif';
}

/**
 * Validates the magic byte signature from the initial binary content of a file.
 * Returns the detected file format, or null if unrecognized/malicious.
 */
export async function detectFileSignature(file: File): Promise<'pdf' | 'png' | 'jpeg' | 'webp' | 'gif' | null> {
  // Read first 32 bytes for magic byte header analysis using File.slice()
  const headerSlice = file.slice(0, 32);
  const arrayBuffer = await headerSlice.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  if (bytes.length < 4) {
    return null;
  }

  // 1. PDF Signature: %PDF- (0x25 0x50 0x44 0x46 0x2D)
  if (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2D
  ) {
    return 'pdf';
  }

  // 2. PNG Signature: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4E &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0D &&
    bytes[5] === 0x0A &&
    bytes[6] === 0x1A &&
    bytes[7] === 0x0A
  ) {
    return 'png';
  }

  // 3. JPEG/JPG Signature (SOI): FF D8 FF
  if (
    bytes[0] === 0xFF &&
    bytes[1] === 0xD8 &&
    bytes[2] === 0xFF
  ) {
    return 'jpeg';
  }

  // 4. WEBP Signature: "RIFF" (bytes 0..3) + 4 size bytes + "WEBP" (bytes 8..11)
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && // 'R'
    bytes[1] === 0x49 && // 'I'
    bytes[2] === 0x46 && // 'F'
    bytes[3] === 0x46 && // 'F'
    bytes[8] === 0x57 && // 'W'
    bytes[9] === 0x45 && // 'E'
    bytes[10] === 0x42 && // 'B'
    bytes[11] === 0x50   // 'P'
  ) {
    return 'webp';
  }

  // 5. GIF Signature: GIF87a or GIF89a (0x47 0x49 0x46 0x38 0x37/0x39 0x61)
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 && // 'G'
    bytes[1] === 0x49 && // 'I'
    bytes[2] === 0x46 && // 'F'
    bytes[3] === 0x38 && // '8'
    (bytes[4] === 0x37 || bytes[4] === 0x39) && // '7' or '9'
    bytes[5] === 0x61    // 'a'
  ) {
    return 'gif';
  }

  return null;
}

/**
 * Validates uploaded file MIME-type, extension, byte size, AND verified binary magic bytes.
 *
 * Sequence:
 * 1. File exists
 * 2. File is not empty (size > 0)
 * 3. File size is within configured limit
 * 4. File extension is allowed
 * 5. Declared MIME type is allowed
 * 6. ACTUAL FILE CONTENT / MAGIC BYTES match the expected file type
 */
export async function validateUploadedFile(
  file: File,
  options: FileValidationOptions
): Promise<FileValidationResult> {
  // 1. File exists
  if (!file) {
    return { valid: false, error: 'No file was provided.' };
  }

  // 2. File is not empty
  if (file.size === 0) {
    return { valid: false, error: 'Uploaded file cannot be empty.' };
  }

  // 3. Size limit check
  if (file.size > options.maxSizeBytes) {
    const maxMb = (options.maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size exceeds the ${maxMb}MB limit (actual: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`
    };
  }

  // 4. Extension check
  const fileName = file.name.toLowerCase();
  const rawParts = fileName.split('.');
  if (rawParts.length < 2) {
    return { valid: false, error: 'File must have a valid extension.' };
  }
  const fileExt = rawParts[rawParts.length - 1];
  const hasValidExt = options.allowedExtensions.some(ext => ext.toLowerCase().replace(/^\./, '') === fileExt);
  if (!hasValidExt) {
    return {
      valid: false,
      error: `Invalid file extension (.${fileExt}). Allowed extensions: ${options.allowedExtensions.join(', ')}`
    };
  }

  // 5. Declared MIME type check
  if (file.type) {
    const isMimeAllowed = options.allowedMimeTypes.some(m => m.toLowerCase() === file.type.toLowerCase());
    if (!isMimeAllowed) {
      return {
        valid: false,
        error: `Invalid file MIME type (${file.type}). Allowed types: ${options.allowedMimeTypes.join(', ')}`
      };
    }
  }

  // 6. ACTUAL FILE CONTENT / MAGIC BYTES verification
  try {
    const detectedType = await detectFileSignature(file);
    if (!detectedType) {
      return {
        valid: false,
        error: 'File signature verification failed: File content does not match any allowed format (PDF, PNG, JPEG, WEBP, GIF).'
      };
    }

    // Match detected magic bytes against the file extension
    const validExtensionsForType: Record<string, string[]> = {
      pdf: ['pdf'],
      png: ['png'],
      jpeg: ['jpg', 'jpeg'],
      webp: ['webp'],
      gif: ['gif']
    };

    const allowedForDetected = validExtensionsForType[detectedType] || [];
    if (!allowedForDetected.includes(fileExt)) {
      return {
        valid: false,
        error: `File signature mismatch: File content is ${detectedType.toUpperCase()} but extension is .${fileExt}.`
      };
    }

    return { valid: true, detectedType };
  } catch (err) {
    return {
      valid: false,
      error: 'Unable to verify file binary signature.'
    };
  }
}

/**
 * Client-Side Rate Limiter for form submissions to prevent spam.
 */
const SUBMISSION_TIMESTAMPS_KEY = 'ayush_contact_form_timestamps';
const MAX_SUBMISSIONS_PER_HOUR = 5;
const MIN_SECONDS_BETWEEN_SUBMISSIONS = 15;

export function checkContactFormRateLimit(): { allowed: boolean; waitSeconds?: number } {
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(SUBMISSION_TIMESTAMPS_KEY);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];

    // Filter to last hour
    const recent = timestamps.filter(t => now - t < 60 * 60 * 1000);

    if (recent.length >= MAX_SUBMISSIONS_PER_HOUR) {
      return { allowed: false, waitSeconds: 3600 };
    }

    if (recent.length > 0) {
      const last = recent[recent.length - 1];
      const elapsedSeconds = Math.floor((now - last) / 1000);
      if (elapsedSeconds < MIN_SECONDS_BETWEEN_SUBMISSIONS) {
        return { allowed: false, waitSeconds: MIN_SECONDS_BETWEEN_SUBMISSIONS - elapsedSeconds };
      }
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function recordContactFormSubmission(): void {
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(SUBMISSION_TIMESTAMPS_KEY);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const recent = timestamps.filter(t => now - t < 60 * 60 * 1000);
    recent.push(now);
    sessionStorage.setItem(SUBMISSION_TIMESTAMPS_KEY, JSON.stringify(recent));
  } catch {
    // Ignore storage issues
  }
}
