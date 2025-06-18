const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const moment = require('moment');
const authMiddleware = require('../middlewares/authMiddleware'); // Ensure this is used

// GET /api/dashboard - Personalized per user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Get current user's ID

    // Fetch only items that belong to the logged-in user
    const items = await Item.find({ userId });

    const now = new Date();
    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.quantity <= 2).length;

    const expiringSoonItems = items.filter(item =>
      item.expirationDate &&
      new Date(item.expirationDate) > now &&
      new Date(item.expirationDate) <= moment().add(3, 'days').toDate()
    ).length;

    const expiredItems = items.filter(item =>
      item.expirationDate &&
      new Date(item.expirationDate) < now
    ).length;

    const recentAlerts = [];

    items.forEach(item => {
      const expDate = new Date(item.expirationDate);

      if (item.quantity <= 2) {
        recentAlerts.push({
          type: 'low-stock',
          name: item.name,
          message: `${item.name} is running low (${item.quantity} left).`
        });
      }

      if (item.expirationDate) {
        const diff = moment(expDate).diff(moment(), 'days');

        if (expDate < now) {
          recentAlerts.push({
            type: 'expired',
            name: item.name,
            message: `${item.name} has expired.`
          });
        } else if (diff >= 0 && diff <= 3) {
          recentAlerts.push({
            type: 'expiring-soon',
            name: item.name,
            message: `${item.name} is expiring in ${diff} day(s).`
          });
        }
      }
    });

    res.json({
      totalItems,
      lowStockItems,
      expiringSoonItems,
      expiredItems,
      recentAlerts
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
