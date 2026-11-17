import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  enquiryType: string;
  message: string;
  submittedAt: string;
}

const inquiriesStore: InquiryRecord[] = [];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health & API endpoints for Contact Form
  app.get('/api/inquiries', (_req, res) => {
    res.json({ inquiries: inquiriesStore });
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, enquiryType, message } = req.body || {};

    if (!name || !email || !message) {
      res.status(400).json({
        ok: false,
        error: 'Name, email, and message are required.',
      });
      return;
    }

    const record: InquiryRecord = {
      id: `inq-${Date.now()}`,
      name: String(name).trim(),
      email: String(email).trim(),
      enquiryType: String(enquiryType || 'General Collaboration').trim(),
      message: String(message).trim(),
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
    };

    inquiriesStore.unshift(record);

    res.status(201).json({
      ok: true,
      message: 'Your message has been received. Gunjit Bhagwate’s team will respond shortly.',
      inquiry: record,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
