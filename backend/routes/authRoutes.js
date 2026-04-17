const express = require('express');
const router = express.Router();
const { sendToQueue } = require('../config/rabbitmq');

const { register, login } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/register', register);
router.post('/login', loginLimiter, login);

module.exports = router;