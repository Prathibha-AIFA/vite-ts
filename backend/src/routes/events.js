const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middlewares/auth');

// public read
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ _id: -1 }).limit(200).exec();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// create event (require auth)
router.post('/', auth, async (req, res) => {
  try {
    const { type, timestamp } = req.body;
    const username = req.user?.username || 'unknown';
    const ev = new Event({ username, type, timestamp });
    await ev.save();
    res.status(201).json(ev);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

module.exports = router;
