const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// 🔥 OPTIONAL SERVICES (SAFE LOAD)
let redisClient = null;
let sendToQueue = null;

try {
  redisClient = require('../config/redisClient');
} catch {}

try {
  sendToQueue = require('../config/rabbitmq').sendToQueue;
} catch {}


// ===============================
// ✅ GET ALL PACKAGES (CACHE + QUEUE)
// ===============================
router.get('/', async (req, res) => {
  try {
    console.log(`📦 Packages fetched by worker ${process.pid}`);

    // ✅ Queue (optional)
    try {
      if (sendToQueue) {
        sendToQueue("packageQueue", { action: "fetch_packages" });
      }
    } catch (err) {
      console.log("⚠️ Queue error:", err.message);
    }

    // ✅ CACHE CHECK
    if (redisClient) {
      try {
        const cachedData = await redisClient.get("packages");

        if (cachedData) {
          console.log("⚡ Serving from Redis cache");

          return res.json({
            success: true,
            source: "cache",
            data: JSON.parse(cachedData)
          });
        }
      } catch (err) {
        console.log("⚠️ Redis read error:", err.message);
      }
    }

    // ✅ FETCH FROM DB
    console.log("💾 Fetching from MongoDB");

    const packages = await Package.find().populate('destination');

    // ✅ STORE CACHE
    if (redisClient) {
      try {
        await redisClient.setEx("packages", 60, JSON.stringify(packages));
      } catch (err) {
        console.log("⚠️ Redis write error:", err.message);
      }
    }

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
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ===============================
// ✅ CREATE PACKAGE
// ===============================
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const newPackage = await Package.create(req.body);

    // 🔥 CLEAR CACHE
    if (redisClient) {
      try {
        await redisClient.del("packages");
        console.log("🧹 Cache cleared after CREATE");
      } catch {}
    }

    res.status(201).json({
      success: true,
      data: newPackage
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ===============================
// ✅ UPDATE PACKAGE
// ===============================
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (redisClient) {
      try {
        await redisClient.del("packages");
        console.log("🧹 Cache cleared after UPDATE");
      } catch {}
    }

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ===============================
// ✅ DELETE PACKAGE
// ===============================
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);

    if (redisClient) {
      try {
        await redisClient.del("packages");
        console.log("🧹 Cache cleared after DELETE");
      } catch {}
    }

    res.json({
      success: true,
      message: "Package deleted"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;