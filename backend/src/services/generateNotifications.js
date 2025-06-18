const Item = require('../models/Item');
const Notification = require('../models/Notification');

const generateNotifications = async () => {
  const today = new Date();
  const items = await Item.find().populate('userId'); // ✅ Fix here

  // console.log(`🔍 Found ${items.length} items in database`);

  for (const item of items) {
    if (!item.userId) {
      // console.error(`❌ Item "${item.name}" does not have a valid user. Skipping...`);
      continue;
    }

    const userId = item.userId._id;
    const expDate = new Date(item.expirationDate);
    const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

    // console.log(`📦 Item: ${item.name} | Expires in ${daysLeft} day(s) | User: ${userId}`);

    let message;

    if (daysLeft < 0) {
      message = `Your item "${item.name}" has expired.`;
    } else if (daysLeft <= 7) {
      message = `Your item "${item.name}" will expire in ${daysLeft} day(s).`;
    }

    if (message) {
      const alreadyExists = await Notification.findOne({ user: userId, message });
      if (!alreadyExists) {
        try {
          await Notification.create({ user: userId, message });
          // console.log(`✅ Created notification: ${message}`);
        } catch (err) {
          console.error('❌ Error creating notification:', err);
        }
      } else {
        // console.log(`⚠️ Notification already exists: ${message}`);
      }
    }
  }

  // console.log('🎉 Notifications generation completed.');
};

module.exports = generateNotifications;
