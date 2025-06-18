const mongoose = require('mongoose');

const Item = require('../models/Item');
const User = require('../models/User');

// User-specific analytics
const getAnalyticsOverview = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); // Ensures it's an ObjectId

    // Logging for userId
    // console.log("User ID from request:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch total items
    const totalItems = await Item.countDocuments({ userId });
    // console.log("Total Items Count:", totalItems);

    // Low stock items count (quantity < 5)
    const lowStock = await Item.countDocuments({ userId, quantity: { $lt: 5 } });

    // Category distribution (group by category)
    const categoryDistribution = await Item.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Monthly cost calculation (sum of cost per month)
    const monthlyCost = await Item.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalCost: { $sum: "$cost" }
        }
      }
    ]);

    // Expiring items (items expiring in the next 30 days)
    const expiringItems = await Item.countDocuments({
      userId,
      expirationDate: { $lt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    });

    // Distinct categories and locations
    const totalCategories = await Item.distinct("category", { userId });
    const totalLocations = await Item.distinct("location", { userId });

    // Location count (distribution)
    const locationAggregation = await Item.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $ifNull: ["$location", "Unspecified"] }, // Group by 'Unspecified' if location is null or missing
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert location aggregation to a format similar to categoryCounts
    const locationCounts = {};
    locationAggregation.forEach(loc => {
      const locationName = loc._id || 'Unspecified'; // Ensure that "Unspecified" is set if the location is null
      locationCounts[locationName] = loc.count;
    });

    // Cost per day (bar chart data)
    const dailyCostAggregation = await Item.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalCost: { $sum: "$cost" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const costPerDay = {};
    dailyCostAggregation.forEach(entry => {
      costPerDay[entry._id] = entry.totalCost;
    });

    // Convert category distribution for frontend
    const categoryCounts = {};
    categoryDistribution.forEach(cat => {
      categoryCounts[cat._id || 'Uncategorized'] = cat.count;
    });

    const monthlyAddedItems = {};
    monthlyCost.forEach(month => {
      monthlyAddedItems[month._id] = month.totalCost;
    });

    // Return the final analytics data
    const analyticsData = {
      totalItems,
      lowStockCount: lowStock,
      expiringSoonCount: expiringItems,
      categoryCounts,
      monthlyAddedItems,
      totalCategories: totalCategories.length,
      totalLocations: totalLocations.length,
      locationCounts, // Return the location distribution in the required format
      costPerDay,
    };

    res.json(analyticsData);

  } catch (error) {
    console.error("Error in getting analytics:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getAnalyticsOverview };
