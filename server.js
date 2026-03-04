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
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = 'tblXAvmhs1lWNIXCv';

  if (!token || !baseId) {
    return res.status(500).json({ error: 'Missing Airtable credentials' });
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?pageSize=100`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── WEATHER PROXY (Open-Meteo) ──────────────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Missing lat/lon' });

  try {
    // Get yesterday's date and 2 days before
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate() - 2);
    const threeDaysAgo = new Date(today); threeDaysAgo.setDate(today.getDate() - 3);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    const fmt = d => d.toISOString().split('T')[0];

    // Historical + forecast in one call
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode` +
      `&start_date=${fmt(threeDaysAgo)}&end_date=${fmt(tomorrow)}` +
      `&timezone=Asia/Jerusalem`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.daily) return res.status(500).json({ error: 'No weather data' });

    const dates = data.daily.time;
    const maxTemps = data.daily.temperature_2m_max;
    const minTemps = data.daily.temperature_2m_min;
    const precip = data.daily.precipitation_sum;
    const codes = data.daily.weathercode;

    const getDay = (dateStr) => {
      const i = dates.indexOf(dateStr);
      if (i === -1) return null;
      return {
        date: dateStr,
        temp_max: Math.round(maxTemps[i]),
        temp_min: Math.round(minTemps[i]),
        rain_mm: Math.round(precip[i] * 10) / 10,
        code: codes[i]
      };
    };

    const history = [
      getDay(fmt(threeDaysAgo)),
      getDay(fmt(twoDaysAgo)),
      getDay(fmt(yesterday))
    ].filter(Boolean);

    const tomorrowData = getDay(fmt(tomorrow));

    res.json({ history, tomorrow: tomorrowData });
  } catch (err) {
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
