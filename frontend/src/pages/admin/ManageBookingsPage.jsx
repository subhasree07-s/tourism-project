import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axiosInstance";
import styles from "./AdminPages.module.css";

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);

      const res = await api.get("/bookings");

      console.log("Bookings:", res.data);

      setBookings(res.data.data);

    } catch (err) {
      console.error(err);
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.page}>
        <h1>📋 Manage Bookings</h1>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Package</th>
                  <th>Hotel</th>
                  <th>People</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8}>No bookings found</td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.user?.name || "—"}</td>
                      <td>{b.package?.name || "—"}</td>

                      <td>
                        <b>{b.hotel?.name}</b><br />
                        ₹{b.hotel?.pricePerDay}
                      </td>

                      <td>{b.numberOfPeople}</td>

                      <td>₹{b.totalAmount}</td>

                      <td>{b.paymentMethod}</td>

                      <td>
                        <span className={styles.status}>
                          {b.status}
                        </span>
                      </td>

                      <td>
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageBookingsPage;