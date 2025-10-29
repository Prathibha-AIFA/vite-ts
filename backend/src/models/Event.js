const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  username: String,
  type: { type: String, enum: ['login', 'logout'] },
  timestamp: String,
});

module.exports = mongoose.model('Event', eventSchema);
