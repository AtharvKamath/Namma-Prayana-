import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateItineraryBackend } from './src/server/itineraryGenerator.ts';
import { handleAssistantChat, getAssistantStatus } from './src/server/assistantService.ts';
import { sendSupportContactMessage } from './src/server/contactService.ts';
import { sendEmailOtp, verifyEmailOtp } from './src/server/otpService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Health check endpoint for Cloud Run
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// Safe status endpoint (reports whether Gemini feature flag is enabled, NEVER exposes keys)
app.get('/api/itinerary/status', (_req, res) => {
  const isEnabled = String(process.env.ENABLE_GEMINI_AI || '').toLowerCase().trim() === 'true';
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && process.env.GEMINI_API_KEY.trim());

  res.json({
    geminiEnabled: isEnabled,
    hasKeyConfigured: hasKey,
    mode: isEnabled && hasKey ? 'gemini-ai' : 'curated-fallback',
  });
});

// API route for itinerary generation
app.post('/api/itinerary/generate', async (req, res) => {
  try {
    const input = req.body || {};
    // Ensure durationDays is within realistic bounds (1 - 14 days)
    if (input.durationDays) {
      input.durationDays = Math.min(Math.max(parseInt(input.durationDays, 10) || 3, 1), 14);
    }
    const itinerary = await generateItineraryBackend(input);
    res.json(itinerary);
  } catch (err: any) {
    console.error('Server error generating itinerary:', err?.message || err);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

// Safe status endpoint for floating assistant
app.get('/api/assistant/status', (_req, res) => {
  res.json(getAssistantStatus());
});

// API route for floating assistant chat
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const response = await handleAssistantChat(req.body || {});
    res.json(response);
  } catch (err: any) {
    console.error('Server error in assistant chat:', err?.message || err);
    res.status(500).json({ error: 'Failed to process assistant request' });
  }
});

// API route for contact support messages
app.post(['/api/support/contact', '/api/contact/send'], async (req, res) => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';
    const result = await sendSupportContactMessage({
      name: req.body?.name,
      email: req.body?.email,
      message: req.body?.message,
      bot_field: req.body?.bot_field,
      clientIp,
    });
    res.status(200).json(result);
  } catch (err: any) {
    console.error('Error handling contact message:', err?.message || err);
    const status = err?.message?.includes('Too many requests') ? 429 : 400;
    res.status(status).json({
      success: false,
      error: err?.message || 'Failed to send message. Please try again later.'
    });
  }
});
// API route for sending email OTP
app.post('/api/auth/send-email-otp', async (req, res) => {
  try {
    const { email, fullName } = req.body || {};
    const result = await sendEmailOtp({ email, fullName });
    res.status(200).json(result);
  } catch (err: any) {
    console.error('Error sending Email OTP:', err?.message || err);
    const status = err?.message?.includes('wait') ? 429 : 400;
    res.status(status).json({
      success: false,
      error: err?.message || 'Failed to send verification email. Please check the email address and try again.'
    });
  }
});

// API route for verifying email OTP
app.post('/api/auth/verify-email-otp', async (req, res) => {
  try {
    const { email, code } = req.body || {};
    const result = await verifyEmailOtp({ email, code });
    res.status(200).json(result);
  } catch (err: any) {
    console.error('Error verifying Email OTP:', err?.message || err);
    res.status(400).json({
      success: false,
      error: err?.message || 'Invalid or expired verification code.'
    });
  }
});

// API route for saving uploaded logo permanently to public directory
app.post('/api/dev/save-logo', (req, res) => {
  try {
    const { imageBase64 } = req.body || {};
    const base64Data = imageBase64?.replace(/^data:image\/\w+;base64,/, '');
    if (!base64Data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const publicImagesDir = path.resolve(__dirname, 'public/images');
    const publicDir = path.resolve(__dirname, 'public');

    if (!fs.existsSync(publicImagesDir)) {
      fs.mkdirSync(publicImagesDir, { recursive: true });
    }

    fs.writeFileSync(path.resolve(publicImagesDir, 'namma-prayana-logo.png'), buffer);
    fs.writeFileSync(path.resolve(publicDir, 'Karnataka Travel Panorama Logo.png'), buffer);
    fs.writeFileSync(path.resolve(publicDir, 'logo.png'), buffer);

    res.json({ success: true, message: 'Logo saved to public assets directory' });
  } catch (err: any) {
    console.error('Error saving logo in server.ts:', err);
    res.status(500).json({ error: err?.message || 'Failed to save logo' });
  }
});

// Serve frontend: Vite dev middleware in dev, static dist in production
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
  try {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } catch (err) {
    console.warn('[Server] Could not start Vite dev middleware:', err);
  }
} else {
  const distPath = path.resolve(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
  }

  // Fallback to index.html for SPA routing in production
  app.get('*', (_req, res) => {
    const indexPath = path.resolve(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(200).send('Namma Prayana Server is running.');
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Namma Prayana full-stack server running on http://0.0.0.0:${PORT}`);
});
