const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
  location: String,
  quantity: Number,
  cost:Number,
  expirationDate: Date,
  barcode: String,
  notes: String,
  image: String, // Will hold base64 string or a file path
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add user reference
}, {
  timestamps: true // Automatically add createdAt and updatedAt
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
