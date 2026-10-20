import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use('/api/itinerary/status', async (req, res, next) => {
            if (req.method !== 'GET') {
              return next();
            }
            const isEnabled = String(process.env.ENABLE_GEMINI_AI || '').toLowerCase().trim() === 'true';
            const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && process.env.GEMINI_API_KEY.trim());
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              geminiEnabled: isEnabled,
              hasKeyConfigured: hasKey,
              mode: isEnabled && hasKey ? 'gemini-ai' : 'curated-fallback',
            }));
          });

          server.middlewares.use('/api/itinerary/generate', async (req, res, next) => {
            if (req.method !== 'POST') {
              return next();
            }

            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const parsedBody = JSON.parse(body || '{}');
                // Dynamically import the backend generator
                const { generateItineraryBackend } = await import('./src/server/itineraryGenerator.ts');
                const itinerary = await generateItineraryBackend(parsedBody);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify(itinerary));
              } catch (error: any) {
                console.error('API Error in /api/itinerary/generate:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: error?.message || 'Failed to generate itinerary' }));
              }
            });
          });

          server.middlewares.use('/api/assistant/status', async (req, res, next) => {
            if (req.method !== 'GET') {
              return next();
            }
            const { getAssistantStatus } = await import('./src/server/assistantService.ts');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(getAssistantStatus()));
          });

          server.middlewares.use('/api/assistant/chat', async (req, res, next) => {
            if (req.method !== 'POST') {
              return next();
            }

            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const parsedBody = JSON.parse(body || '{}');
                const { handleAssistantChat } = await import('./src/server/assistantService.ts');
                const chatResponse = await handleAssistantChat(parsedBody);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify(chatResponse));
              } catch (error: any) {
                console.error('API Error in /api/assistant/chat:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: error?.message || 'Failed to process assistant request' }));
              }
            });
          });

          server.middlewares.use('/api/support/contact', async (req, res, next) => {
            if (req.method !== 'POST') {
              return next();
            }

            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const parsedBody = JSON.parse(body || '{}');
                const { sendSupportContactMessage } = await import('./src/server/contactService.ts');
                const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';
                const result = await sendSupportContactMessage({
                  ...parsedBody,
                  clientIp,
                });
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify(result));
              } catch (error: any) {
                console.error('API Error in /api/support/contact:', error);
                const statusCode = error?.message?.includes('Too many requests') ? 429 : 400;
                res.statusCode = statusCode;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: false,
                  error: error?.message || 'Failed to send message'
                }));
              }
            });
          });

          server.middlewares.use('/api/contact/send', async (req, res, next) => {
            if (req.method !== 'POST') {
              return next();
            }

            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const parsedBody = JSON.parse(body || '{}');
                const { sendSupportContactMessage } = await import('./src/server/contactService.ts');
                const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';
                const result = await sendSupportContactMessage({
                  ...parsedBody,
                  clientIp,
                });
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify(result));
              } catch (error: any) {
                console.error('API Error in /api/contact/send:', error);
                const statusCode = error?.message?.includes('Too many requests') ? 429 : 400;
                res.statusCode = statusCode;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: false,
                  error: error?.message || 'Failed to send message'
                }));
              }
            });
          });

          server.middlewares.use('/api/dev/save-logo', async (req, res, next) => {
            if (req.method !== 'POST') {
              return next();
            }

            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const fs = await import('fs');
                const parsed = JSON.parse(body || '{}');
                const base64Data = parsed.imageBase64?.replace(/^data:image\/\w+;base64,/, '');
                if (!base64Data) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'No image data provided' }));
                  return;
                }

                const buffer = Buffer.from(base64Data, 'base64');
                const publicImagesDir = path.resolve(__dirname, 'public/images');
                const publicDir = path.resolve(__dirname, 'public');

                if (!fs.existsSync(publicImagesDir)) {
                  fs.mkdirSync(publicImagesDir, { recursive: true });
                }

                // Save to all target paths for 100% resilience
                fs.writeFileSync(path.resolve(publicImagesDir, 'namma-prayana-logo.png'), buffer);
                fs.writeFileSync(path.resolve(publicDir, 'Karnataka Travel Panorama Logo.png'), buffer);
                fs.writeFileSync(path.resolve(publicDir, 'logo.png'), buffer);

                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ 
                  success: true, 
                  message: 'Successfully saved logo to public/images/namma-prayana-logo.png' 
                }));
              } catch (err: any) {
                console.error('Error saving logo:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err?.message || 'Failed to save logo' }));
              }
            });
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Dev server must run on port 3000
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
