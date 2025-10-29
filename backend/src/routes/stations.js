const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

let stations = [];
// Try to load the stations JSON from project root (one level above backend)
try {
  const p = path.resolve(process.cwd(), '..', 'indian_railway_stations.json');
  const raw = fs.readFileSync(p, 'utf8');
  stations = JSON.parse(raw);
  if (!Array.isArray(stations)) stations = [];
  console.log(`Loaded ${stations.length} stations from ${p}`);
} catch (err) {
  console.warn('Could not load stations JSON:', err.message);
  stations = [];
}

// GET /api/stations?query=&page=1&limit=50
router.get('/', (req, res) => {
  try {
    const q = (req.query.query || '').toString().toLowerCase();
    const page = Math.max(1, parseInt((req.query.page || '1').toString(), 10));
    const limit = Math.max(10, Math.min(200, parseInt((req.query.limit || '50').toString(), 10)));

    let filtered = stations;
    if (q) {
      filtered = stations.filter((s) => {
        // support name and code match
        const name = (s.name || s.station_name || '').toString().toLowerCase();
        const code = (s.code || s.station_code || '').toString().toLowerCase();
        return name.includes(q) || code.includes(q);
      });
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filtered.slice(start, end).map((s) => {
      // normalize fields
      return {
        name: s.name || s.station_name || s.station || s.station_name_l || '',
        code: s.code || s.station_code || s.t || '',
      };
    });

    res.json({ total, page, limit, items });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

module.exports = router;
