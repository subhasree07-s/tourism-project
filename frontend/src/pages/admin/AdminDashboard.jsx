import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../api/axiosInstance";
import styles from "./AdminPages.module.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    bookings: 0,
    packages: 0,
    destinations: 0,
    users: 0,
    revenue: 0,
    topPackage: "N/A",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // ✅ GET TOKEN
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("❌ No token found. Please login again.");
          return;
        }

        // ✅ SEND TOKEN TO BACKEND
        const res = await api.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ Dashboard Data:", res.data);

        // ✅ SET DATA FROM DATABASE
        setStats({
          bookings: res.data.bookings || 0,
          packages: res.data.packages || 0,
          destinations: res.data.destinations || 0,
          users: res.data.users || 0,
          revenue: res.data.revenue || 0,
          topPackage: res.data.topPackage || "N/A",
        });

      } catch (err) {
        console.error("❌ Dashboard error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.dashboard}>
        <h1 className={styles.title}>👑 Admin Dashboard</h1>
        <p className={styles.subtitle}>System overview</p>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className={styles.cardGrid}>

            {/* BOOKINGS */}
            <div
              className={styles.card}
              onClick={() => navigate("/admin/bookings")}
            >
              <div className={styles.icon}>📅</div>
              <h2>{stats.bookings}</h2>
              <p>Total Bookings</p>
            </div>

            {/* PACKAGES */}
            <div
              className={styles.card}
              onClick={() => navigate("/admin/packages")}
            >
              <div className={styles.icon}>✈️</div>
              <h2>{stats.packages}</h2>
              <p>Tour Packages</p>
            </div>

            {/* DESTINATIONS */}
            <div
              className={styles.card}
              onClick={() => navigate("/admin/destinations")}
            >
              <div className={styles.icon}>📍</div>
              <h2>{stats.destinations}</h2>
              <p>Destinations</p>
            </div>

            {/* USERS */}
            <div
              className={styles.card}
              onClick={() => navigate("/admin/users")}
            >
              <div className={styles.icon}>👥</div>
              <h2>{stats.users}</h2>
              <p>Total Users</p>
            </div>

            {/* REVENUE */}
            <div className={styles.card}>
              <div className={styles.icon}>💰</div>
              <h2>₹ {stats.revenue}</h2>
              <p>Total Revenue</p>
            </div>

            {/* MOST BOOKED */}
            <div className={styles.card}>
              <div className={styles.icon}>🔥</div>
              <h2>{stats.topPackage}</h2>
              <p>Most Booked Package</p>
            </div>

          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;