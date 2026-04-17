const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendToQueue } = require('../config/rabbitmq');
const redisClient = require('../config/redisClient');


// ===============================
// REGISTER (WITH CONCURRENCY)
// ===============================
exports.register = async (req, res, next) => {

  const { email } = req.body;
  const lockKey = `register:${email}`;

  let lockAcquired = false;

  try {
    console.log("🧾 Register request");

    // 🔒 REDIS LOCK
    const lock = await redisClient.set(lockKey, "locked", {
      NX: true,
      EX: 10
    });

    if (!lock) {
      return res.status(429).json({
        success: false,
        message: "Another registration in progress"
      });
    }

    lockAcquired = true;
    console.log("✅ Lock acquired");

    // 🔍 CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // ✅ CREATE USER
    const user = await User.create(req.body);

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token
    });

  } catch (err) {

    // 🔥 HANDLE DUPLICATE ERROR (DB LEVEL)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    next(err);

  } finally {
    // 🔓 RELEASE LOCK ONLY IF ACQUIRED
    if (lockAcquired) {
      await redisClient.del(lockKey);
      console.log("🔓 Lock released");
    }
  }
};


// ===============================
// LOGIN
// ===============================
exports.login = async (req, res, next) => {
  try {
    console.log("🔥 Login API hit");

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id, user.role);

    // 📤 SEND EVENT TO AUTH MICROSERVICE
    try {
      console.log("📤 Sending login event to authQueue...");

      sendToQueue("authQueue", {
        email,
        action: "login"
      });

    } catch (err) {
      console.log("⚠️ Queue error:", err.message);
    }

    res.json({
      success: true,
      token
    });

  } catch (err) {
    next(err);
  }
};