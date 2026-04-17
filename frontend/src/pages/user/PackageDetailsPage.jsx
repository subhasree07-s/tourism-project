import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../api/axiosInstance";
import styles from "./UserPages.module.css";

const PackageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ REVIEW STATES
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // ===============================
  // ✅ FETCH PACKAGE + REVIEWS
  // ===============================
  useEffect(() => {
    const loadData = async () => {
      try {
        const pkgRes = await api.get(`/packages/${id}`);
        setPkg(pkgRes.data.data);

        // 🔥 FETCH REVIEWS FROM DB
        const reviewRes = await api.get(`/reviews/package/${id}`);
        setReviews(reviewRes.data.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // ===============================
  // ✅ SUBMIT REVIEW (FIXED)
  // ===============================
  const handleSubmit = async () => {
    try {
      if (!name || !comment) {
        alert("Please fill all fields");
        return;
      }

      const res = await api.post("/reviews", {
        packageId: pkg._id,
        rating,
        comment,
        name, // ✅ IMPORTANT
      });

      // ✅ ADD NEW REVIEW FROM BACKEND RESPONSE
      setReviews((prev) => [res.data.data, ...prev]);

      // RESET
      setName("");
      setComment("");
      setRating(5);

      alert("✅ Review submitted successfully");

    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ Failed to submit review");
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) return <p>Loading...</p>;
  if (!pkg) return <p>Package not found</p>;

  return (
    <>
      <Navbar />

      <div className={styles.detailsContainer}>

        {/* HERO */}
        <div className={styles.detailsHero}>
          <h1>{pkg.name}</h1>
          <span className={styles.badge}>{pkg.duration}</span>
          <p>{pkg.description}</p>
        </div>

        {/* FEATURES */}
        <div className={styles.detailsGrid}>

          <div className={styles.detailCard}>
            <h3>🚗 Transportation</h3>
            <ul>
              {pkg.transportation?.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          <div className={styles.detailCard}>
            <h3>🎡 Sightseeing</h3>
            <ul>
              {pkg.sightseeing?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className={styles.detailCard}>
            <h3>🍽 Meals</h3>
            <ul>
              {pkg.meals?.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* ITINERARY */}
        <div className={styles.itinerary}>
          <h2>🗓 Itinerary</h2>
          <ol>
            {pkg.itinerary?.map((day, i) => (
              <li key={i}>{day}</li>
            ))}
          </ol>
        </div>

        {/* HOTELS */}
        <h2>🏨 Available Hotels</h2>

        <div className={styles.hotelGrid}>
          {pkg.hotels?.map((hotel, index) => (
            <div key={index} className={styles.hotelCard}>

              <img
                src={
                  hotel.image
                }
                alt={hotel.name}
              />

              <h4>{hotel.name}</h4>
              <p>₹{hotel.pricePerDay}</p>
              <p>{hotel.description}</p>

              <button
                onClick={() =>
                  navigate("/payment", {
                    state: {
                      package: pkg,
                      hotel: hotel,
                    },
                  })
                }
              >
                Select Hotel
              </button>
            </div>
          ))}
        </div>

        {/* ⭐ REVIEWS */}
        <div className={styles.reviews}>
          <h2>⭐ Customer Reviews</h2>

          <select
            className={styles.input}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={5}>⭐⭐⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={1}>⭐</option>
          </select>

          <textarea
            placeholder="Write your experience..."
            className={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className={styles.reviewBtn} onClick={handleSubmit}>
            Submit Review
          </button>

          {/* SHOW REVIEWS */}
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <div className={styles.reviewList}>
              {reviews.map((r) => (
                <div key={r._id} className={styles.reviewCard}>
                  <h4>{r.name || "User"}</h4>   {/* ✅ FIXED */}
                  <p>⭐ {r.rating}</p>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default PackageDetailsPage;