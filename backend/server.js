require('dotenv').config();

const cluster = require("cluster");
const os = require("os");

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const errorHandler = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');
const { connectQueue } = require('./config/rabbitmq');
const urlRoutes = require('./routes/urlRoutes');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT || 5000;

// ===============================
// ✅ CLUSTER CONTROL (FIXED FOR DEPLOYMENT)
// ===============================
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction && cluster.isMaster) {
  const numCPUs = os.cpus().length;

  console.log(`🧠 Master running with ${numCPUs} CPUs`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    console.log(`✅ Worker ${worker.process.pid} is online`);
  });

} else {

  // ===============================
  // ✅ CONNECT SERVICES (ONLY IN WORKER)
  // ===============================
  connectDB();
  connectQueue();

  const app = express();

  // ===============================
  // ✅ MIDDLEWARE
  // ===============================
  app.use(cors({
    origin: "*",   // ✅ changed from localhost to allow deployment
    credentials: true
  }));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use('/api', apiLimiter);

  app.use((req, res, next) => {
    res.on("finish", () => {
      console.log(`✅ Worker ${process.pid} completed ${req.method} ${req.url}`);
    });
    next();
  });

  app.use((req, res, next) => {
    console.log(`👷 Worker ${process.pid} handling ${req.method} ${req.url}`);
    next();
  });

  // ===============================
  // ✅ BASE ROUTE
  // ===============================
  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  // ===============================
  // ✅ API ROUTES
  // ===============================
  app.use('/', urlRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/destinations', destinationRoutes);
  app.use('/api/packages', packageRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/url', urlRoutes);

  // ===============================
  // ✅ ERROR HANDLER
  // ===============================
  app.use(errorHandler);

  // ===============================
  // ✅ START SERVER
  // ===============================
  app.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} running on port ${PORT}`);
  });
}