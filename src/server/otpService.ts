import crypto from 'crypto';
import nodemailer from 'nodemailer';

// In-memory store for Email OTP records
// Key: normalized email (lowercase)
interface OtpRecord {
  email: string;
  hash: string;
  salt: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  resendCooldown: number;
  isVerified: boolean;
}

const otpStore = new Map<string, OtpRecord>();

// Clean up expired records every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(email);
    }
  }
}, 15 * 60 * 1000);

function hashOtp(otp: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(otp).digest('hex');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface SendEmailOtpInput {
  email: string;
  fullName?: string;
}

export interface SendEmailOtpResult {
  success: boolean;
  message: string;
  resendCooldownSeconds: number;
  expiresInMinutes: number;
  messageId?: string;
  previewUrl?: string; // For development / test preview if test account used
}

export async function sendEmailOtp(input: SendEmailOtpInput): Promise<SendEmailOtpResult> {
  const email = (input.email || '').trim().toLowerCase();
  const fullName = (input.fullName || 'Traveler').trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error('Please enter a valid email address.');
  }

  const now = Date.now();
  const existing = otpStore.get(email);

  // Enforce 60-second resend cooldown
  if (existing && now < existing.resendCooldown) {
    const remainingSeconds = Math.ceil((existing.resendCooldown - now) / 1000);
    throw new Error(`Please wait ${remainingSeconds} seconds before requesting a new verification code.`);
  }

  // Generate cryptographic 6-digit OTP code
  const codeInt = crypto.randomInt(100000, 999999);
  const otpCode = codeInt.toString();

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashOtp(otpCode, salt);

  const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
  const COOLDOWN_MS = 60 * 1000; // 60 seconds

  const newRecord: OtpRecord = {
    email,
    hash,
    salt,
    createdAt: now,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    resendCooldown: now + COOLDOWN_MS,
    isVerified: false,
  };

  otpStore.set(email, newRecord);

  // Email Template HTML
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 16px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #0f4c5c;">
        <h2 style="margin: 0; color: #0f4c5c; font-size: 22px; font-weight: 800;">ನಮ್ಮ ಪ್ರಯಾಣ (Namma Prayana)</h2>
        <p style="margin: 4px 0 0; color: #78716c; font-size: 13px; font-weight: 600;">Karnataka AI Travel Planner · Email Verification</p>
      </div>

      <div style="padding: 24px 0; text-align: center;">
        <h3 style="margin: 0 0 12px; color: #292524; font-size: 18px; font-weight: 700;">Namaskara ${escapeHtml(fullName)}! 🙏</h3>
        <p style="margin: 0 0 20px; color: #57534e; font-size: 14px; line-height: 1.5;">
          Thank you for registering with Namma Prayana. Please enter the verification code below on the website to complete your email verification:
        </p>

        <div style="display: inline-block; background-color: #f0fdf4; border: 2px dashed #059669; border-radius: 12px; padding: 16px 32px; margin: 8px 0 20px;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #047857;">${otpCode}</span>
        </div>

        <p style="margin: 0; color: #dc2626; font-size: 12px; font-weight: 600;">
          ⚠️ This code will expire in 10 minutes. Do not share this code with anyone.
        </p>
      </div>

      <div style="border-top: 1px solid #f5f5f4; padding-top: 16px; font-size: 11px; color: #a8a29e; text-align: center; line-height: 1.4;">
        If you did not request this code, you can safely ignore this email.<br/>
        Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ) · Karnataka Travel Portal
      </div>
    </div>
  `;

  const textContent = `
Namaskara ${fullName}! 🙏

Your Namma Prayana account verification code is: ${otpCode}

This code is valid for 10 minutes. Please enter this code on the website to verify your email.

Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ) · Karnataka AI Travel Planner
  `;

  // 1. Send via Resend API if process.env.RESEND_API_KEY is available
  if (process.env.RESEND_API_KEY) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Namma Prayana <onboarding@resend.dev>',
          to: [email],
          subject: `[Namma Prayana] Email Verification Code: ${otpCode}`,
          html: htmlContent,
          text: textContent,
        }),
      });

      if (resendRes.ok) {
        const data = await resendRes.json() as any;
        console.log(`[Email OTP] Code dispatched to ${email} via Resend. Message ID: ${data?.id}`);
        return {
          success: true,
          message: 'Verification code sent to your email address.',
          resendCooldownSeconds: 60,
          expiresInMinutes: 10,
          messageId: data?.id,
        };
      }
      const errBody = await resendRes.json().catch(() => ({}));
      console.warn('[Email OTP] Resend API notice:', errBody);
    } catch (err: any) {
      console.warn('[Email OTP] Resend dispatch notice:', err?.message || err);
    }
  }

  // 2. Send via SMTP if configured
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
        to: email,
        subject: `[Namma Prayana] Email Verification Code: ${otpCode}`,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[Email OTP] Code dispatched to ${email} via SMTP. Message ID: ${info.messageId}`);
      return {
        success: true,
        message: 'Verification code sent to your email address.',
        resendCooldownSeconds: 60,
        expiresInMinutes: 10,
        messageId: info.messageId,
      };
    } catch (err: any) {
      console.warn('[Email OTP] SMTP dispatch notice:', err?.message || err);
    }
  }

  // 3. Nodemailer Ethereal Transporter (Safe real email test transporter for development)
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
      from: `"Namma Prayana" <${testAccount.user}>`,
      to: email,
      subject: `[Namma Prayana] Email Verification Code: ${otpCode}`,
      text: textContent,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`[Email OTP] Code dispatched to ${email} via Ethereal test transporter.`);
    console.log(`[Email OTP] OTP Code: ${otpCode}`);
    if (previewUrl) {
      console.log(`[Email OTP] Real Ethereal Email Preview: ${previewUrl}`);
    }

    return {
      success: true,
      message: 'Verification code sent to your email address.',
      resendCooldownSeconds: 60,
      expiresInMinutes: 10,
      messageId: info.messageId,
      previewUrl: previewUrl || undefined,
    };
  } catch (err: any) {
    console.error('[Email OTP] All email dispatch methods failed:', err);
    throw new Error('Failed to send verification email. Please check server email configuration.');
  }
}

export interface VerifyEmailOtpInput {
  email: string;
  code: string;
}

export interface VerifyEmailOtpResult {
  success: boolean;
  message: string;
  email: string;
  verifiedAt: string;
}

export async function verifyEmailOtp(input: VerifyEmailOtpInput): Promise<VerifyEmailOtpResult> {
  const email = (input.email || '').trim().toLowerCase();
  const code = (input.code || '').trim();

  if (!email || !code) {
    throw new Error('Email address and verification code are required.');
  }

  const record = otpStore.get(email);

  if (!record) {
    throw new Error('No pending verification code found for this email. Please request a new code.');
  }

  const now = Date.now();

  // Check Expiry
  if (now > record.expiresAt) {
    otpStore.delete(email);
    throw new Error('Verification code has expired. Please request a new code.');
  }

  // Check Attempt Limits (Max 5 attempts allowed)
  if (record.attempts >= 5) {
    otpStore.delete(email);
    throw new Error('Maximum verification attempts exceeded for this code. Please request a new verification code.');
  }

  record.attempts += 1;

  // Verify HMAC SHA-256 Hash
  const computedHash = hashOtp(code, record.salt);

  if (computedHash !== record.hash) {
    const remainingAttempts = 5 - record.attempts;
    if (remainingAttempts <= 0) {
      otpStore.delete(email);
      throw new Error('Maximum verification attempts exceeded. Please request a new verification code.');
    }
    throw new Error(`Incorrect verification code. ${remainingAttempts} attempt(s) remaining.`);
  }

  // Verification Succeeded!
  record.isVerified = true;
  // Clear OTP record from store to prevent code reuse
  otpStore.delete(email);

  return {
    success: true,
    message: 'Email address successfully verified!',
    email,
    verifiedAt: new Date().toISOString(),
  };
}
