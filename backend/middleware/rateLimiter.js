const rateLimit = require("express-rate-limit");

// 🌐 GLOBAL LIMITER
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

// 🔐 LOGIN LIMITER (STRICT)
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  }
});

// 🧾 BOOKING LIMITER
const bookingLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2,
  message: {
    success: false,
    message: "Too many booking requests. Please slow down."
  }
});

module.exports = {
  apiLimiter,
  loginLimiter,
  bookingLimiter
};