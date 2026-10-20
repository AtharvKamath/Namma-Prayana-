import nodemailer from 'nodemailer';

// PRIVATE SERVER-SIDE RECIPIENT
// Stored strictly on the server and never sent to the browser or client-side bundles
const DEFAULT_SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'business.atharvk@gmail.com';

interface ContactInput {
  name: string;
  email: string;
  message: string;
  bot_field?: string;
  clientIp?: string;
}

interface ContactResult {
  success: boolean;
  message: string;
  messageId?: string;
}

// In-memory rate limiting map: IP -> timestamp array
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendSupportContactMessage(input: ContactInput): Promise<ContactResult> {
  const { name, email, message, bot_field, clientIp = '127.0.0.1' } = input;

  // 1. Spam honeypot protection: if hidden field is filled, silently drop or reject
  if (bot_field && bot_field.trim() !== '') {
    return {
      success: true,
      message: 'Your inquiry has been received.',
    };
  }

  // 2. Rate limiting check
  if (isRateLimited(clientIp)) {
    throw new Error('Too many requests. Please wait a few minutes before submitting another message.');
  }

  // 3. Validation & Sanitization
  const trimmedName = (name || '').trim().replace(/[\r\n]/g, ' ');
  const trimmedEmail = (email || '').trim().replace(/[\r\n]/g, '');
  const trimmedMessage = (message || '').trim();

  if (!trimmedName || trimmedName.length < 2) {
    throw new Error('Please enter a valid name (at least 2 characters).');
  }
  if (trimmedName.length > 100) {
    throw new Error('Name cannot exceed 100 characters.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    throw new Error('Please provide a valid email address.');
  }
  if (trimmedEmail.length > 150) {
    throw new Error('Email address is too long.');
  }

  if (!trimmedMessage || trimmedMessage.length < 10) {
    throw new Error('Message must be at least 10 characters long.');
  }
  if (trimmedMessage.length > 3000) {
    throw new Error('Message cannot exceed 3000 characters.');
  }

  const recipientEmail = process.env.SUPPORT_EMAIL || DEFAULT_SUPPORT_EMAIL;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #fafaf9; color: #1c1917;">
      <div style="border-bottom: 2px solid #0f4c5c; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #0f4c5c; font-size: 20px;">Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ) — Support Inquiry</h2>
        <p style="margin: 4px 0 0; color: #78716c; font-size: 13px;">New message submitted via Namma Prayana Support Contact Form</p>
      </div>

      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e7e5e4; margin-bottom: 20px;">
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #78716c; width: 100px; font-weight: 600;">Sender:</td>
            <td style="padding: 8px 0; color: #1c1917; font-weight: 700;">${escapeHtml(trimmedName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-weight: 600;">Reply-To:</td>
            <td style="padding: 8px 0; color: #0f4c5c;"><a href="mailto:${escapeHtml(trimmedEmail)}" style="color: #0f4c5c; text-decoration: underline;">${escapeHtml(trimmedEmail)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-weight: 600;">Submitted:</td>
            <td style="padding: 8px 0; color: #44403c;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
          </tr>
        </table>

        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #f5f5f4;">
          <h4 style="margin: 0 0 8px; color: #44403c; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message Content:</h4>
          <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #292524; background-color: #f5f5f4; padding: 14px; border-radius: 6px;">
${escapeHtml(trimmedMessage)}
          </div>
        </div>
      </div>

      <div style="font-size: 11px; color: #a8a29e; text-align: center; border-top: 1px solid #e7e5e4; padding-top: 12px;">
        Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ) Karnataka Travel Portal · Automated Support Dispatch
      </div>
    </div>
  `;

  const textContent = `
Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ) — Support Inquiry
============================================
From: ${trimmedName}
Email: ${trimmedEmail}
Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

Message:
${trimmedMessage}
  `;

  // 4A. Provider 1: Resend HTTP API (if configured)
  if (process.env.RESEND_API_KEY) {
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Namma Prayana Support <onboarding@resend.dev>',
          to: [recipientEmail],
          reply_to: trimmedEmail,
          subject: `[Namma Prayana Support] Message from ${trimmedName}`,
          html: htmlContent,
          text: textContent,
        }),
      });

      if (resendResponse.ok) {
        const data = await resendResponse.json() as any;
        return {
          success: true,
          message: 'Your message has been successfully sent to Namma Prayana Support.',
          messageId: data?.id,
        };
      }
      const errData = await resendResponse.json().catch(() => ({}));
      console.error('Resend API error:', errData);
    } catch (e: any) {
      console.error('Resend dispatch failed:', e?.message || e);
    }
  }

  // 4B. Provider 2: Standard SMTP (Nodemailer) if configured
  if (process.env.SMTP_HOST && (process.env.SMTP_USER || process.env.SMTP_PASS)) {
    try {
      const port = parseInt(process.env.SMTP_PORT || '587', 10);
      const isSecure = port === 465 || String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: isSecure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Namma Prayana" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        replyTo: trimmedEmail,
        subject: `[Namma Prayana Support] Message from ${trimmedName}`,
        text: textContent,
        html: htmlContent,
      });

      return {
        success: true,
        message: 'Your message has been successfully sent to Namma Prayana Support.',
        messageId: info.messageId,
      };
    } catch (e: any) {
      console.error('SMTP dispatch failed:', e?.message || e);
      throw new Error(`Email delivery failed via configured SMTP server: ${e?.message || 'Connection error'}`);
    }
  }

  // 4C. Provider 3: Nodemailer Ethereal Test Account (for preview & development verification)
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Namma Prayana Visitor" <${testAccount.user}>`,
      to: recipientEmail,
      replyTo: trimmedEmail,
      subject: `[Namma Prayana Support] Message from ${trimmedName}`,
      text: textContent,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`[Contact Support] Message dispatched to ${recipientEmail} via Ethereal test transporter.`);
    console.log(`[Contact Support] Message ID: ${info.messageId}`);
    if (previewUrl) {
      console.log(`[Contact Support] Preview URL: ${previewUrl}`);
    }

    return {
      success: true,
      message: 'Your message has been successfully sent to Namma Prayana Support.',
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error('All email delivery options failed:', err);
    throw new Error('Email delivery service is currently not configured or unavailable. Please configure SMTP credentials in server environment variables.');
  }
}
