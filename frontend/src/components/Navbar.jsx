import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // ⭐ Safe admin check (very important)
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Hide navbar if not logged in
  if (!isAuthenticated) return null;

  return (
    <nav className={styles.navbar}>
      {/* Brand */}
      <div className={styles.brand}>
        <Link to="/dashboard">🌍 TourMS</Link>
      </div>

      {/* Navigation Links */}
      <ul className={styles.links}>
        <li>
          <Link to="/destinations">Destinations</Link>
        </li>

        <li>
          <Link to="/packages">Packages</Link>
        </li>


        {/* ⭐ Admin Menu */}
        {isAdmin && (
          <>
            <li className={styles.divider}>|</li>

            <li>
              <Link to="/admin" className={styles.adminLink}>
                Admin Panel
              </Link>
            </li>

            <li>
              <Link to="/admin/users">Users</Link>
            </li>

            <li>
              <Link to="/admin/destinations">Manage Destinations</Link>
            </li>

            <li>
              <Link to="/admin/packages">Manage Packages</Link>
            </li>

            <li>
              <Link to="/admin/bookings">Manage Bookings</Link>
            </li>

            <li>
              <Link to="/admin/reviews">View Reviews</Link>
            </li>
          </>
        )}
      </ul>

      {/* User Info */}
      <div className={styles.userInfo}>
        <span className={styles.role}>
          {isAdmin ? '👑 Admin' : '👤 User'}
        </span>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;