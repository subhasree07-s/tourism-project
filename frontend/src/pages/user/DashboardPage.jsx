import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import styles from "./UserPages.module.css";

const DashboardPage = () => {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <h1>
            Discover Your Next <br />
            <span>Dream Destination</span>
          </h1>

          <p>
            Curated tour packages, premium stays, and unforgettable travel
            experiences — all in one place.
          </p>

          <div className={styles.heroButtons}>
            <Link to="/packages" className={styles.primaryBtn}>
              Explore Packages
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className={styles.features}>
        <h2>Why Travel With Us?</h2>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>🌍 Handpicked Destinations</h3>
            <p>
              Carefully curated destinations for every type of traveler.
            </p>
          </div>

          <div className={styles.card}>
            <h3>🏨 Premium Stays</h3>
            <p>
              Best hotels and resorts with comfort and luxury guaranteed.
            </p>
          </div>

          <div className={styles.card}>
            <h3>💰 Best Price Guarantee</h3>
            <p>
              Transparent pricing with exciting offers and discounts.
            </p>
          </div>

          <div className={styles.card}>
            <h3>📞 24/7 Support</h3>
            <p>
              Dedicated customer support throughout your journey.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.cta}>
        <h2>Ready to Travel?</h2>
        <p>
          Start planning your next holiday with our exclusive tour packages.
        </p>

        <Link to="/packages" className={styles.ctaBtn}>
          Book Your Trip Now
        </Link>
      </section>
    </>
  );
};

export default DashboardPage;