const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const { bookingLimiter } = require('../middleware/rateLimiter');

// =======================================
// ✅ 1. GET ALL BOOKINGS (ADMIN ONLY)
// =======================================
router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')     // get user details
      .populate('package', 'name price'); // get package details

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error("Error fetching bookings:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// =======================================
// ✅ 2. GET LOGGED-IN USER BOOKINGS
// =======================================
router.get('/my', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('package', 'name price');

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error("Error fetching user bookings:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// =======================================
// ✅ 3. CREATE BOOKING (PAYMENT)
// =======================================
router.post('/', authenticate,bookingLimiter, async (req, res) => {
  try {
    console.log(`🧾 Booking handled by worker ${process.pid}`);
    const {
      packageId,
      hotel,
      numberOfPeople,
      totalAmount,
      paymentMethod
    } = req.body;

    // 🔥 validation
    if (!packageId || !hotel || !numberOfPeople || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      package: packageId,
      hotel,
      numberOfPeople,
      totalAmount,
      paymentMethod,
      status: "confirmed"
    });
    const { sendToQueue } = require('../config/rabbitmq');

try {
  console.log("sending booking to queue");
  sendToQueue("bookingQueue", {
    bookingId: booking._id,
    user: req.user._id,
    totalAmount: totalAmount
  });
} catch (err) {
  console.log("⚠️ Queue error:", err.message);
}

    res.status(201).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error("Error creating booking:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// =======================================
// ✅ 4. UPDATE STATUS (OPTIONAL ADMIN)
// =======================================
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// =======================================
// ✅ 5. DELETE BOOKING (OPTIONAL ADMIN)
// =======================================
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booking deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


module.exports = router;