const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { authenticate } = require("../middleware/authMiddleware");


// =======================================
// ✅ CREATE REVIEW (USER)
// =======================================
router.post("/", authenticate, async (req, res) => {
  try {
    const { packageId, rating, comment, name } = req.body;

    // 🔥 VALIDATION
    if (!packageId || !rating || !comment || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const review = await Review.create({
      user: req.user._id,   // logged-in user
      package: packageId,
      rating,
      comment,
      name,                 // ✅ store name
    });

    res.status(201).json({
      success: true,
      data: review,
    });

  } catch (err) {
    console.error("Create review error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// =======================================
// ✅ GET ALL REVIEWS (ADMIN)
// =======================================
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")     // optional
      .populate("package", "name");       // show package name

    res.json({
      success: true,
      data: reviews,
    });

  } catch (err) {
    console.error("Fetch reviews error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// =======================================
// ✅ GET REVIEWS FOR ONE PACKAGE (USER PAGE)
// =======================================
router.get("/package/:id", async (req, res) => {
  try {
    const reviews = await Review.find({
      package: req.params.id,
    });

    res.json({
      success: true,
      data: reviews,
    });

  } catch (err) {
    console.error("Fetch package reviews error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


module.exports = router;