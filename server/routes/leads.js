const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'sales') query.assignedTo = req.user._id;
    const leads = await Lead.find(query).populate('assignedTo', 'name email').sort('-createdAt');
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const lead = await Lead.create({ ...req.body, assignedTo: req.user._id });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, rbac('admin', 'manager'), async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
