import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axiosInstance";
import styles from "./AdminPages.module.css";

const ManageReviewsPage = () => {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    try {
      const res = await api.get("/reviews");

      console.log("Reviews:", res.data);

      setReviews(res.data.data);

    } catch (err) {
      console.error(err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.page}>
        <h1>⭐ Manage Reviews</h1>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Package</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={4}>No reviews found</td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r._id}>
                    <td>{r.package?.name || "—"}</td>
                    <td>⭐ {r.rating}</td>
                    <td>{r.comment}</td>
                    <td>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ManageReviewsPage;