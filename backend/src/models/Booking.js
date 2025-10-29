const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  from: String,
  to: String,
  date: String,
  passengers: Number,
  cls: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
