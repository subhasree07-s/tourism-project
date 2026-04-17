const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// ===============================
// ✅ GET ALL USERS (ADMIN ONLY)
// ===============================
router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // 🔥 hide password

    res.json({
      success: true,
      data: users
    });

  } catch (err) {
    console.error("Fetch users error:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;