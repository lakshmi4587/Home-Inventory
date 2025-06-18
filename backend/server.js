require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cron = require("node-cron");
const forgotPasswordRoutes = require('./src/routes/forgotPasswordRoutes');

const authRoutes = require('./src/routes/authRoutes');
const itemRoutes = require("./src/routes/itemRoutes");
const dashboardRoutes = require("./src/routes/dashboard");
const notificationRoutes = require("./src/routes/notificationRoutes");
const generateNotifications = require('./src/services/generateNotifications');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
// Initialize Express App
const app = express();

// Set up multer storage and file upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Routes
app.use('/api/auth', forgotPasswordRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// Cron job to generate notifications daily at 9:00 AM
cron.schedule('* * * * *', async () => {
  // console.log(`⏰ Running daily notification job at ${new Date().toISOString()}`);
  await generateNotifications();
});

// (Optional) run once when server starts for testing
// generateNotifications(); // Uncomment for immediate test

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
