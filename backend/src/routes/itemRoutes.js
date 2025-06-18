const express = require('express');
const { addItem, getItems, updateItem, deleteItem } = require('../controllers/itemController');
const multer = require('multer');
const Item = require('../models/Item');
const authenticate = require('../middlewares/authMiddleware');  // Import auth middleware
const router = express.Router();

// Set up multer for file upload (image)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post('/add', authenticate, upload.single('image'), addItem);  // Use authenticate middleware to check user
router.get('/', authenticate, getItems);  // Use authenticate to fetch items for the logged-in user

// New route to update an existing item (edit functionality)
router.put('/:id', authenticate, upload.single('image'), updateItem);  // Ensure user can only edit their own items
router.delete('/:id', authenticate, deleteItem);  // Ensure user can only delete their own items

// Dashboard summary route (user-specific)
router.get('/dashboard-summary', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;  // Get user ID from authenticated request

    const totalItems = await Item.countDocuments({ userId: userId });

    const lowStockItems = await Item.find({ userId: userId, quantity: { $lt: 5 } }).limit(5);

    const recentItems = await Item.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name category quantity location image createdAt');

    // Optional: Items expiring within the next 7 days
    const upcomingExpiry = await Item.find({
      userId: userId,
      expirationDate: {
        $gte: new Date(),
        $lte: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    }).select('name expirationDate');

    res.json({
      totalItems,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      recentItems,
      upcomingExpiry,
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
