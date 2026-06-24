const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const wonLeads = await Lead.countDocuments({ stage: 'Won' });
    const lostLeads = await Lead.countDocuments({ stage: 'Lost' });
    const totalRevenue = await Lead.aggregate([
      { $match: { stage: 'Won' } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);
    const byStage = await Lead.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$value' } } }
    ]);
    const bySource = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);
    const recentLeads = await Lead.find().sort('-createdAt').limit(5).populate('assignedTo', 'name');
    res.json({ totalLeads, wonLeads, lostLeads, totalRevenue: totalRevenue[0]?.total || 0, byStage, bySource, recentLeads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
