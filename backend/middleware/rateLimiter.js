const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redisClient = require("../config/redisClient");

// 🔥 GLOBAL LIMIT (applies to ALL users together)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // total requests allowed globally
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

// 🔐 LOGIN LIMIT (still per user/IP if needed)
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts."
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

// 🧾 BOOKING LIMIT (GLOBAL for demo)
const bookingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2, // only 2 bookings allowed globally per minute
  message: {
    success: false,
    message: "Too many booking requests globally."
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

module.exports = {
  apiLimiter,
  loginLimiter,
  bookingLimiter
};