const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const verificationStore = new Map(); // In-memory store: email => { code, expiresAt }

// Transporter setup (replace with your SMTP or Gmail config)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Reset Code
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

  verificationStore.set(email, { code, expiresAt });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your HomeHive Password Reset Code',
      text: `Your password reset code is: ${code}. It expires in 5 minutes.`,
    });

    res.status(200).json({ message: 'Verification code sent to email' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// Verify Code
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  const record = verificationStore.get(email);

  if (!record || record.code !== code) {
    return res.status(400).json({ message: 'Invalid or expired code' });
  }

  if (Date.now() > record.expiresAt) {
    verificationStore.delete(email);
    return res.status(400).json({ message: 'Code has expired' });
  }

  // Mark as verified
  record.verified = true;
  verificationStore.set(email, record);

  res.status(200).json({ message: 'Code verified successfully' });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const record = verificationStore.get(email);

  if (!record || !record.verified) {
    return res.status(400).json({ message: 'Email not verified for password reset' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  verificationStore.delete(email); // Clean up after reset

  res.status(200).json({ message: 'Password reset successfully' });
});

module.exports = router;
