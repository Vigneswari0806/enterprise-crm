const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      String,
  phone:      String,
  company:    String,
  source:     { type: String, enum: ['web', 'referral', 'cold', 'event'], default: 'web' },
  stage:      { type: String, enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'], default: 'New' },
  value:      { type: Number, default: 0 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes:      String,
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
