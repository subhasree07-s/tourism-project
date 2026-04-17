import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axiosInstance';
import styles from './UserPages.module.css';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/destinations')
      .then((res) => setDestinations(res.data?.data || []))
      .catch(() => setError('Failed to load destinations.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <h1>📍 Destinations</h1>
        {loading && <p>Loading…</p>}
        {error   && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {destinations.length === 0 ? (
                <tr><td colSpan={3}>No destinations found.</td></tr>
              ) : destinations.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.country}</td>
                  <td>{d.description?.slice(0, 80)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default DestinationsPage;
