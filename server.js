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

// ─── WEATHER PROXY ───────────────────────────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const key = process.env.WEATHER_API_KEY;

  if (!key) return res.status(500).json({ error: 'Missing weather API key' });
  if (!lat || !lon) return res.status(400).json({ error: 'Missing lat/lon' });

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&cnt=8`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) return res.status(response.status).json(data);

    // Get tomorrow's forecast (first entries ~24hrs ahead)
    const tomorrow = data.list.slice(2, 6);
    const temps = tomorrow.map(f => f.main.temp);
    const rain = tomorrow.some(f => f.rain || f.weather[0].main === 'Rain');
    const desc = tomorrow[0]?.weather[0]?.description || 'unknown';
    const wind = Math.max(...tomorrow.map(f => f.wind.speed)) * 3.6; // m/s to km/h

    res.json({
      temp_min: Math.round(Math.min(...temps)),
      temp_max: Math.round(Math.max(...temps)),
      rain_expected: rain,
      description: desc,
      wind_kmh: Math.round(wind)
    });
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
