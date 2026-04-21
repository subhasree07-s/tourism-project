const express = require('express');
const router = express.Router();

// Controllers (already contain RabbitMQ logic — DO NOT TOUCH)
const { register, login } = require('../controllers/authController');

// Rate limiter
const { loginLimiter } = require('../middleware/rateLimiter');


// Register → uses global limiter from server.js
router.post('/register', register);

// Login → stricter limiter applied
router.post('/login', loginLimiter, login);

module.exports = router;