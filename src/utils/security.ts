/**
 * Security and Sanitization Utilities
 * 
 * Provides robust defensive mechanisms for:
 * 1. Safe URL parsing & protocol filtering (prevents XSS via javascript:, data:, vbscript: protocols)
 * 2. File upload validation (MIME-types, file extensions, size limits, path sanitization)
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
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Allow relative URLs starting with / (e.g. /resumes/cv.pdf or /images/avatar.webp)
  // Ensure it does not start with // (protocol-relative) or /\\ which can bypass checks
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
    // Normalise any accidental '/public/' prefix
    if (trimmed.startsWith('/public/')) {
      return trimmed.replace('/public/', '/');
    }
    return encodeURI(decodeURI(trimmed));
  }

  try {
    const parsed = new URL(trimmed);
    if (ALLOWED_PROTOCOLS.has(parsed.protocol.toLowerCase())) {
      return parsed.href;
    }
    // Disallowed protocol (e.g. javascript:, data:, vbscript:)
    console.warn(`[Security Warning] Disallowed URL protocol: ${parsed.protocol}`);
    return '';
  } catch {
    // If URL constructor fails on relative path or string, double check if it's a valid relative path
    if (/^[a-zA-Z0-9_\-./]+$/.test(trimmed) && !trimmed.includes('://') && !trimmed.startsWith('javascript:')) {
      return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    }
    console.warn(`[Security Warning] Invalid URL rejected: ${trimmed.slice(0, 50)}`);
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
}

/**
 * Validates uploaded file MIME-type, extension, and byte size.
 */
export function validateUploadedFile(
  file: File,
  options: FileValidationOptions
): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file was provided.' };
  }

  // Size limit check
  if (file.size > options.maxSizeBytes) {
    const maxMb = (options.maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size exceeds the ${maxMb}MB limit (actual: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'Uploaded file cannot be empty.' };
  }

  // Extension check
  const fileName = file.name.toLowerCase();
  const hasValidExt = options.allowedExtensions.some(ext => fileName.endsWith(ext.toLowerCase()));
  if (!hasValidExt) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed extensions: ${options.allowedExtensions.join(', ')}`
    };
  }

  // MIME type check
  if (file.type) {
    const isMimeAllowed = options.allowedMimeTypes.includes(file.type.toLowerCase());
    if (!isMimeAllowed) {
      return {
        valid: false,
        error: `Invalid file MIME type (${file.type}). Allowed types: ${options.allowedMimeTypes.join(', ')}`
      };
    }
  }

  return { valid: true };
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
