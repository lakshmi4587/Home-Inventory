const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const Notification = require('../models/Notification');

// Get all notifications for logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Get top 5 latest notifications (for dashboard)
router.get('/latest', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching latest notifications' });
  }
});

// Mark all as read
router.patch('/:id/read', authenticate, async (req, res) => {

  try {
    const { id } = req.params;

    const updated = await Notification.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: { read: true } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

module.exports = router;
