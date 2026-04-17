import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../api/axiosInstance";
import styles from "./UserPages.module.css";

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/packages")
      .then((res) => {
        console.log("Packages:", res.data?.data); // ✅ DEBUG
        setPackages(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔍 FILTER
  const filteredPackages = packages.filter((pkg) =>
    pkg.name?.toLowerCase().includes(search.toLowerCase()) ||
    pkg.destination?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className={styles.packagesContainer}>
        <h1>Tour Packages</h1>
        <p className={styles.sub}>
          Handpicked holiday packages with best prices
        </p>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by destination or package name..."
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* GRID */}
        <div className={styles.packageGrid}>
          {loading ? (
            <p>Loading...</p>
          ) : filteredPackages.length === 0 ? (
            <p>No packages found.</p>
          ) : (
            filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                className={styles.packageCard}
              >
                {/* ✅ FIXED IMAGE */}
                <img
                  src={
                    pkg.image && pkg.image.trim() !== ""
                      ? pkg.image
                      : "https://picsum.photos/400/300"
                  }
                  alt={pkg.name}
                  className={styles.packageImg}
                  onError={(e) => {
                    e.target.src = "https://picsum.photos/400/300";
                  }}
                />

                {/* CONTENT */}
                <div className={styles.packageContent}>
                  <h3>{pkg.name}</h3>

                  {/* ✅ FIX DESTINATION */}
                  <p>{pkg.destination?.name || "Unknown Location"}</p>

                  <div className={styles.features}>
                    <span>🏨 Hotel</span>
                    <span>🍽 Meals</span>
                    <span>🚗 Pickup</span>
                  </div>

                  <div className={styles.priceRow}>
                    <div>
                      <h2>₹{pkg.price}</h2>
                      <p>/ person</p>
                    </div>

                    <button
                      className={styles.bookBtn}
                      onClick={() => {
                        if (!pkg._id) {
                          console.error("Missing ID:", pkg);
                          return;
                        }
                        navigate(`/package/${pkg._id}`);
                      }}
                    >
                      Book this Package
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default PackagesPage;