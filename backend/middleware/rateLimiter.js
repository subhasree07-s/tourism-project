const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redisClient = require("../config/redisClient");

// ===============================
// 🔥 GLOBAL API LIMIT (ALL USERS)
// ===============================
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // total requests allowed globally
  keyGenerator: () => "global", // 🔥 makes it GLOBAL
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests globally. Please try later."
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});


// ===============================
// 🔐 LOGIN LIMIT (PER USER/IP)
// ===============================
const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 5, // per user/IP
  message: {
    success: false,
    message: "Too many login attempts."
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});


// ===============================
// 🧾 BOOKING LIMIT (GLOBAL)
// ===============================
const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 bookings allowed globally
  keyGenerator: () => "global", // 🔥 makes it GLOBAL
  message: {
    success: false,
    message: "Too many booking requests globally."
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});


// ===============================
// ✅ EXPORT
// ===============================
module.exports = {
  apiLimiter,
  loginLimiter,
  bookingLimiter
};