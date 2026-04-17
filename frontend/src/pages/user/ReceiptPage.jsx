import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import styles from "./ReceiptPage.module.css";

const ReceiptPage = () => {
  const navigate = useNavigate();

  // ✅ GET DATA FROM LOCAL STORAGE
  const data = JSON.parse(localStorage.getItem("receipt"));

  if (!data) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <h2>No receipt data found</h2>
        </div>
      </>
    );
  }

  const { customer, booking, payment } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.card}>

          <h1>Booking Receipt</h1>
          <p className={styles.success}>✔ Payment Successful</p>

          <hr />

          {/* CUSTOMER */}
          <div className={styles.section}>
            <h3>Customer Details</h3>
            <p><b>Name:</b> {customer.name}</p>
            <p><b>Email:</b> {customer.email}</p>
            <p><b>Phone:</b> {customer.phone}</p>
          </div>

          <hr />

          {/* BOOKING */}
          <div className={styles.section}>
            <h3>Booking Details</h3>
            <p><b>Booking ID:</b> {booking.bookingId}</p>
            <p><b>Package:</b> {booking.packageName}</p>
            <p><b>Hotel:</b> {booking.hotelName}</p>
            <p><b>Date:</b> {booking.date}</p>
          </div>

          <hr />

          {/* PAYMENT */}
          <div className={styles.section}>
            <h3>Payment Summary</h3>
            <p>Package Price: ₹{payment.packagePrice}</p>
            <p>Hotel Price: ₹{payment.hotelPrice}</p>
            <p>GST: ₹{payment.gst}</p>

            <h2>Total Paid: ₹{payment.total}</h2>
            <p><b>Payment Method:</b> {payment.method}</p>
          </div>

          <hr />

          {/* BUTTONS */}
          <div className={styles.buttons}>
            <button onClick={handlePrint}>
              Download / Print Receipt
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default ReceiptPage;