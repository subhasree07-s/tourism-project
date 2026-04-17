const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Package = require("../models/Package");
const Destination = require("../models/Destination");
const User = require("../models/User");

// ❌ NO authenticate here
// ❌ NO authorizeAdmin here

router.get("/", async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalPackages = await Package.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    
    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].total : 0;

    const topPackageData = await Booking.aggregate([
      {
        $group: {
          _id: "$package",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let mostBookedPackage = "N/A";

    if (topPackageData.length > 0) {
      const pkg = await Package.findById(topPackageData[0]._id);
      mostBookedPackage = pkg?.name || "N/A";
    }

    res.json({
      bookings: totalBookings,
      packages: totalPackages,
      destinations: totalDestinations,
      users: totalUsers,
      revenue: totalRevenue,
      topPackage: mostBookedPackage,
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;