import express from 'express';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// ─── AIRTABLE PROXY ───────────────────────────────────────────────────────────
app.get('/api/routes', async (req, res) => {
  const token = process.env.AIRTABLE_TOKEN;
  console.log('Token starts with:', token ? token.substring(0, 10) : 'MISSING');
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = 'tblXAvmhs1lWNIXCv';

  if (!token || !baseId) {
    return res.status(500).json({ error: 'Missing Airtable credentials' });
  }

 try {
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?pageSize=1`;
    console.log('Calling:', url);
    console.log('Token length:', token.length);
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Airtable status:', response.status);
    const text = await response.text();
    console.log('Airtable response:', text.substring(0, 200));
    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.log('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── SERVE FRONTEND ───────────────────────────────────────────────────────────
if (isProd) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createServer({ server: { middlewareMode: true } });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
