// Supabase Edge Function (Deno runtime)
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// RFC 5322 compliant email regex matching client-side validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

Deno.serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // 2. Enforce POST only
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method Not Allowed. Only POST is accepted.' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // 3. Safe JSON parsing
  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON payload.' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // 4. Honeypot check: silently simulate success for automated spam bots
  if (body.website_hp && typeof body.website_hp === 'string' && body.website_hp.trim() !== '') {
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // 5. Server-side sanitization and length bounding
  const rawName = typeof body.name === 'string' ? body.name.trim() : '';
  const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
  const rawSubject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';

  const name = rawName.slice(0, 100);
  const email = rawEmail.slice(0, 120);
  const subject = rawSubject.slice(0, 150);
  const message = rawMessage.slice(0, 3000);

  // 6. Validation checks
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: 'Please fill in all required fields (Name, Email, and Message).' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return new Response(
      JSON.stringify({ error: 'Please enter a valid email address.' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  if (message.length < 10) {
    return new Response(
      JSON.stringify({ error: 'Message must be at least 10 characters long.' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // 7. Verify Resend configuration (server-side Edge Function secret)
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    console.error('RESEND_API_KEY secret is not configured in Supabase Edge Function environment.');
    return new Response(
      JSON.stringify({
        error: 'Email delivery service is currently not configured. Please contact directly via the email listed on the portfolio.',
      }),
      {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  const toEmail = Deno.env.get('CONTACT_TO_EMAIL') || 'dayush849@gmail.com';
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Portfolio Contact <onboarding@resend.dev>';
  const emailSubject = subject ? `[Portfolio] ${subject}` : `[Portfolio] Message from ${name}`;

  // 8. Sanitize HTML for email rendering
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject || 'Not specified');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0F172A; color: #F8FAFC; border-radius: 12px; border: 1px solid #1E293B;">
      <div style="border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #38BDF8; margin: 0 0 4px 0; font-size: 20px;">New Portfolio Contact Message</h2>
        <p style="color: #94A3B8; margin: 0; font-size: 13px;">Received via Ayush Dutta Portfolio Website</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #94A3B8; width: 90px; font-weight: bold;">Sender:</td>
          <td style="padding: 8px 0; color: #F8FAFC;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94A3B8; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0; color: #38BDF8;"><a href="mailto:${safeEmail}" style="color: #38BDF8; text-decoration: none;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94A3B8; font-weight: bold;">Subject:</td>
          <td style="padding: 8px 0; color: #F8FAFC;">${safeSubject}</td>
        </tr>
      </table>

      <div style="background-color: #1E293B; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 4px solid #38BDF8;">
        <div style="color: #94A3B8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; font-weight: bold;">Message:</div>
        <div style="color: #F8FAFC; font-size: 14px; line-height: 1.6; word-break: break-word;">${safeMessage}</div>
      </div>

      <div style="font-size: 11px; color: #64748B; border-top: 1px solid #334155; padding-top: 12px;">
        Reply directly to this email to respond to ${safeName} (${safeEmail}).
      </div>
    </div>
  `;

  const textContent = `New Portfolio Contact Message\n\nSender: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}\n`;

  // 9. Dispatch to Resend REST API
  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: emailSubject,
        text: textContent,
        html: htmlContent,
      }),
    });

    const resendData = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error('Resend API response error:', resendData);
      return new Response(
        JSON.stringify({ error: 'Failed to deliver message via email service. Please reach out directly.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Unexpected exception dispatching email via Resend:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected network error occurred while sending your message.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
