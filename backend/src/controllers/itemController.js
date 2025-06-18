const Item = require('../models/Item');
const path = require('path');

// Add item handler
const addItem = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    
    // Handle file upload if exists
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    // Create a new item
    const newItem = new Item({
      ...req.body,  // Spread the rest of the fields
      image: imagePath,  // Add the image path to the item
      userId: userId,    // Associate the item with the user
    });

    // Save to database
    await newItem.save();
    res.status(201).json(newItem);  // Return the saved item
  } catch (err) {
    res.status(500).json({ message: 'Error adding item', error: err });
  }
};

// Get items handler
const getItems = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    const items = await Item.find({ userId: userId });  // Fetch only items associated with the logged-in user
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items', error: err });
  }
};

// Update item handler
const updateItem = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    const itemId = req.params.id;

    // Check if the item exists and belongs to the current user
    const item = await Item.findOne({ _id: itemId, userId: userId });

    if (!item) {
      return res.status(404).json({ message: 'Item not found or not owned by the user' });
    }

    // Handle file upload if exists
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    // Update the item
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        ...req.body,  // Spread the updated fields
        image: imagePath || item.image, // Update the image if provided, otherwise keep the existing image
      },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Error updating item', error: err });
  }
};

// Delete item handler
const deleteItem = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    const itemId = req.params.id;

    // Check if the item exists and belongs to the current user
    const item = await Item.findOne({ _id: itemId, userId: userId });

    if (!item) {
      return res.status(404).json({ message: 'Item not found or not owned by the user' });
    }

    // Delete the item
    await Item.findByIdAndDelete(itemId);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err });
  }
};

module.exports = {
  addItem,
  getItems,
  updateItem,
  deleteItem,
};
