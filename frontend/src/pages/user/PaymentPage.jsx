import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../api/axiosInstance";
import styles from "./PaymentPage.module.css";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { package: pkg, hotel } = state || {};

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    persons: 1,
    method: "UPI",
  });

  const [loading, setLoading] = useState(false);

  // ❗ SAFETY CHECK
  if (!pkg || !hotel) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <h2>❌ Invalid Booking</h2>
          <p>Please select a package and hotel first.</p>
        </div>
      </>
    );
  }

  const packagePrice = pkg.price;
  const hotelPrice = hotel.pricePerDay * form.persons;
  const gst = Math.round((packagePrice + hotelPrice) * 0.05);
  const total = packagePrice + hotelPrice + gst;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ FINAL PAYMENT FUNCTION
  const handlePayment = async () => {
    try {
      // VALIDATION
      if (!form.name || !form.email || !form.phone) {
        alert("Please fill all details");
        return;
      }

      setLoading(true);

      // ✅ SAVE BOOKING IN DB
      const res = await api.post("/bookings", {
        packageId: pkg._id,
        hotel: hotel,
        numberOfPeople: Number(form.persons),
        totalAmount: total,
        paymentMethod: form.method,
      });

      console.log("Booking success:", res.data);

      // ✅ CREATE STRUCTURED RECEIPT (VERY IMPORTANT)
      const receiptData = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        booking: {
          bookingId: "BOOK" + Math.floor(100000 + Math.random() * 900000),
          packageName: pkg.name,
          hotelName: hotel.name,
          date: new Date().toLocaleString(),
        },
        payment: {
          packagePrice: pkg.price,
          hotelPrice: hotel.pricePerDay * form.persons,
          gst: gst,
          total: total,
          method: form.method,
        },
      };

      // ✅ STORE IN LOCAL STORAGE
      localStorage.setItem("receipt", JSON.stringify(receiptData));

      // ✅ REDIRECT TO RECEIPT PAGE
      navigate("/receipt");

    } catch (err) {
      console.error("Payment error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
        "❌ Payment Failed. Check console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h1>💳 Payment & Booking</h1>

        {/* SUMMARY */}
        <div className={styles.card}>
          <h2>Booking Summary</h2>
          <p><b>Package:</b> {pkg.name}</p>
          <p><b>Hotel:</b> {hotel.name}</p>

          <p>Package Price: ₹{packagePrice}</p>
          <p>Hotel Price: ₹{hotelPrice}</p>
          <p>GST (5%): ₹{gst}</p>

          <h3>Total Payable: ₹{total}</h3>
        </div>

        {/* CUSTOMER DETAILS */}
        <div className={styles.card}>
          <h2>Customer Details</h2>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="persons"
            type="number"
            min="1"
            value={form.persons}
            onChange={handleChange}
          />
        </div>

        {/* PAYMENT METHOD */}
        <div className={styles.card}>
          <h2>Payment Method</h2>

          <select
            name="method"
            value={form.method}
            onChange={handleChange}
          >
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
        </div>

        {/* BUTTON */}
        <button
          className={styles.payBtn}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : `Confirm & Pay ₹${total}`}
        </button>
      </div>
    </>
  );
};

export default PaymentPage;