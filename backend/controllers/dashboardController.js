/**
 * controllers/dashboardController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All five MongoDB aggregation pipelines for the admin dashboard.
 *
 * VIVA NOTES (brief per pipeline):
 *
 *  1. totalUsers
 *     $match  → filter only active users (isActive:true)
 *     $count  → outputs a single document { total: N }
 *
 *  2. totalBookings
 *     $group  → group ALL documents (_id:null) and $sum:1 for every doc
 *               also $sum totalAmount to get revenue in the same pass
 *     Produces: { totalBookings, totalRevenue, confirmedRevenue }
 *
 *  3. monthlyStats
 *     $match  → ignore cancelled bookings so cancelled ones don't skew revenue
 *     $group  → group by { year, month } extracted via $year/$month operators
 *               accumulate count and revenue per bucket
 *     $sort   → chronological order (year ASC, month ASC)
 *     $project→ reshape output to a friendly { year, month, count, revenue }
 *
 *  4. mostBookedPackage
 *     $group  → group by package ObjectId, $sum:1 to count bookings per package
 *     $sort   → descending by count
 *     $limit  → keep only top-1
 *     $lookup → JOIN with the 'packages' collection to pull package details
 *     $unwind → flatten the looked-up array into a single object
 *     $project→ return packageId, name, price, duration and bookingCount
 *
 *  5. bookingStatusBreakdown (bonus – pie chart data)
 *     $group  → group by status field, count each group
 *     $project→ rename _id to status for clarity
 */

const Booking = require('../models/Booking');
const User    = require('../models/User');

// ─── GET /api/dashboard ───────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res, next) => {
  try {

    // ── 1. Total Users ────────────────────────────────────────────────────────
    // STAGE 1 ($match): keep only active accounts
    // STAGE 2 ($count): emit { total: N }
    const userStats = await User.aggregate([
      { $match: { isActive: true } },
      { $count: 'total' }
    ]);
    const totalUsers = userStats[0]?.total ?? 0;

    // ── 2. Total Bookings + Total Revenue ─────────────────────────────────────
    // STAGE 1 ($group): _id:null groups EVERY document together
    //   $sum: 1         → count each document
    //   $sum:$totalAmount → add up all amounts (all statuses)
    //   conditional $sum with $cond: only add when status === 'confirmed'
    const bookingOverview = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          confirmedRevenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'confirmed'] }, '$totalAmount', 0]
            }
          }
        }
      },
      {
        // STAGE 2 ($project): drop the _id:null, rename fields
        $project: {
          _id: 0,
          totalBookings: 1,
          totalRevenue: 1,
          confirmedRevenue: 1
        }
      }
    ]);
    const {
      totalBookings    = 0,
      totalRevenue     = 0,
      confirmedRevenue = 0
    } = bookingOverview[0] ?? {};

    // ── 3. Monthly Booking Statistics ────────────────────────────────────────
    // STAGE 1 ($match): exclude cancelled bookings
    // STAGE 2 ($group): bucket by year+month using $year/$month date operators
    // STAGE 3 ($sort) : chronological
    // STAGE 4 ($project): clean output shape
    const monthlyStats = await Booking.aggregate([
      {
        $match: { status: { $ne: 'cancelled' } }
      },
      {
        $group: {
          _id: {
            year:  { $year:  '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookingCount: { $sum: 1 },
          revenue:      { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          _id: 0,
          year:         '$_id.year',
          month:        '$_id.month',
          bookingCount: 1,
          revenue:      1
        }
      }
    ]);

    // ── 4. Most Booked Package ────────────────────────────────────────────────
    // STAGE 1 ($group) : count bookings per package ObjectId
    // STAGE 2 ($sort)  : highest count first
    // STAGE 3 ($limit) : only the #1 result
    // STAGE 4 ($lookup): JOIN packages collection → array field 'packageInfo'
    // STAGE 5 ($unwind): flatten that array to a single sub-doc
    // STAGE 6 ($project): final clean shape
    const mostBookedResult = await Booking.aggregate([
      {
        $group: {
          _id:          '$package',
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from:         'packages',   // MongoDB collection name (lowercase plural)
          localField:   '_id',        // field in Booking pipeline
          foreignField: '_id',        // matching field in Package collection
          as:           'packageInfo' // output array name
        }
      },
      { $unwind: '$packageInfo' },
      {
        $project: {
          _id:          0,
          packageId:    '$_id',
          name:         '$packageInfo.name',
          price:        '$packageInfo.price',
          duration:     '$packageInfo.duration',
          bookingCount: 1,
          totalRevenue: 1
        }
      }
    ]);
    const mostBookedPackage = mostBookedResult[0] ?? null;

    // ── 5. Booking Status Breakdown (for pie chart) ───────────────────────────
    // STAGE 1 ($group) : group by 'status' field, count each
    // STAGE 2 ($project): rename _id → status for readability
    const statusBreakdown = await Booking.aggregate([
      {
        $group: {
          _id:   '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id:    0,
          status: '$_id',
          count:  1
        }
      }
    ]);

    // ── Combine and respond ───────────────────────────────────────────────────
    res.json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalRevenue,
        confirmedRevenue,
        monthlyStats,
        mostBookedPackage,
        statusBreakdown
      }
    });

  } catch (err) {
    next(err);
  }
};
