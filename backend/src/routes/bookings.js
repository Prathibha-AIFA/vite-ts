const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middlewares/auth');

// create booking (require auth)
router.post('/', auth, async (req, res) => {
  try {
    const { from, to, date, passengers, cls } = req.body;
    const booking = new Booking({ from, to, date, passengers, cls });
    await booking.save();
    res.status(201).json({ id: booking._id, ...booking.toObject() });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// list bookings (require auth)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(200).exec();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

module.exports = router;
