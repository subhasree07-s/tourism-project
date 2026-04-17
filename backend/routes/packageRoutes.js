const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const redisClient = require('../config/redisClient');
const { sendToQueue } = require('../config/rabbitmq');


// ===============================
// ✅ GET ALL PACKAGES (WITH CACHE + QUEUE)
// ===============================
router.get('/', async (req, res) => {
  try {
    console.log(`📦 Packages fetched by worker ${process.pid}`);

    // 🔥 SEND EVENT TO MICROSERVICE (FIXED POSITION)
    try {
      console.log("📤 Sending package event to queue...");

      sendToQueue("packageQueue", {
        action: "fetch_packages"
      });

    } catch (err) {
      console.log("⚠️ Queue error:", err.message);
    }

    // 🔥 1. Check cache
    const cachedData = await redisClient.get("packages");

    if (cachedData) {
      return res.json({
        success: true,
        source: "cache",
        data: JSON.parse(cachedData)
      });
    }

    // 🔥 2. Fetch from DB
    const packages = await Package.find().populate('destination');

    // 🔥 3. Store in cache
    await redisClient.setEx("packages", 60, JSON.stringify(packages));

    res.json({
      success: true,
      source: "database",
      data: packages
    });

  } catch (err) {
    console.error("Fetch packages error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ===============================
// ✅ GET SINGLE PACKAGE
// ===============================
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).populate('destination');

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    res.json({
      success: true,
      data: pkg
    });

  } catch (err) {
    console.error("Fetch single package error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ===============================
// ✅ CREATE PACKAGE (CLEAR CACHE)
// ===============================
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      destination,
      duration,
      price,
      image,
      transportation,
      sightseeing,
      meals,
      itinerary,
      hotels
    } = req.body;

    if (!name || !destination || !duration || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const newPackage = await Package.create({
      name,
      description,
      destination,
      duration,
      price,
      image,
      transportation: transportation || [],
      sightseeing: sightseeing || [],
      meals: meals || [],
      itinerary: itinerary || [],
      hotels: hotels || []
    });

    // 🔥 CLEAR CACHE
    await redisClient.del("packages");

    res.status(201).json({
      success: true,
      data: newPackage
    });

  } catch (err) {
    console.error("Create package error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ===============================
// ✅ UPDATE PACKAGE (CLEAR CACHE)
// ===============================
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await redisClient.del("packages");

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    console.error("Update package error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ===============================
// ✅ DELETE PACKAGE (CLEAR CACHE)
// ===============================
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);

    await redisClient.del("packages");

    res.json({
      success: true,
      message: "Package deleted"
    });

  } catch (err) {
    console.error("Delete package error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


module.exports = router;