const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('lead', 'name company')
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(50);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const activity = await Activity.create({ ...req.body, user: req.user._id });
    const populated = await activity.populate([
      { path: 'lead', select: 'name company' },
      { path: 'user', select: 'name' }
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
