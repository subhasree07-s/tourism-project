import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ===============================
  // HANDLE SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(form);

      // ✅ SUCCESS MESSAGE
      setSuccess('Account created successfully ✅');

      // OPTIONAL: redirect after 1 sec
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);

    } catch (err) {
      // ✅ SHOW BACKEND ERROR MESSAGE
      setError(
        err.response?.data?.message ||
        err.message ||
        'Registration failed'
      );

      console.error(err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>

        <h2 className={styles.title}>🌍 Tourism MS</h2>
        <p className={styles.subtitle}>Create an account</p>

        {/* ❌ ERROR MESSAGE */}
        {error && <div className={styles.error}>{error}</div>}

        {/* ✅ SUCCESS MESSAGE */}
        {success && (
          <div style={{ color: 'green', marginBottom: '10px' }}>
            {success}
          </div>
        )}

        {/* NAME */}
        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </label>

        {/* EMAIL */}
        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        {/* PASSWORD */}
        <label className={styles.label}>
          Password
          <input
            className={styles.input}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="min 6 characters"
            minLength={6}
            required
          />
        </label>

        {/* BUTTON */}
        <button
          className={styles.btn}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Register'}
        </button>

        {/* FOOTER */}
        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>

      </form>
    </div>
  );
};

export default RegisterPage;