const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redisClient = require("../config/redisClient");


// ===============================
// 🔥 GLOBAL API LIMIT (ALL USERS)
// ===============================
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  keyGenerator: () => "api_global",   // 🔥 unique global key
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests globally. Please try later."
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "api_limit_"   // 🔥 separate namespace
  }),
});


// ===============================
// 🔐 LOGIN LIMIT (PER USER/IP)
// ===============================
const loginLimiter = rateLimit({
  windowMs: 1*60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many login attempts."
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "login_limit_"   // 🔥 separate namespace
  }),
});


// ===============================
// 🧾 BOOKING LIMIT (GLOBAL)
// ===============================
const bookingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: () => "booking_global",   // 🔥 FIXED GLOBAL KEY
  message: {
    success: false,
    message: "Too many booking requests globally."
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "booking_limit_"   // 🔥 CRITICAL FIX
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