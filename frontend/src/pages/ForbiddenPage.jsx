import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ForbiddenPage.module.css';

const ForbiddenPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.icon}>🚫</span>
        <h1>Access Denied</h1>
        <p>You don't have permission to view this page.</p>
        <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
