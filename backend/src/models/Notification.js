const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, {
  timestamps: true,  // Automatically add createdAt and updatedAt
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
