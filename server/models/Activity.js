const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  type:      { type: String, enum: ['call', 'email', 'meeting', 'note'], required: true },
  subject:   { type: String, required: true },
  body:      String,
  outcome:   String,
  lead:      { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
