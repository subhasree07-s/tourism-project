
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axiosInstance";
import styles from "./AdminPages.module.css";

const ManageDestinationsPage = () => {

  const [destinations, setDestinations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: ""
  });

  // Load destinations
  const loadDestinations = async () => {
    try {
      const res = await api.get("/destinations");
      setDestinations(res.data.data);
    } catch (err) {
      console.error("Error loading destinations:", err);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add destination
  const addDestination = async (e) => {
    e.preventDefault();

    try {

      await api.post("/destinations", formData);

      alert("Destination added successfully");

      setFormData({
        name: "",
        country: "",
        description: ""
      });

      loadDestinations();

    } catch (err) {

      console.error("Destination create error:", err.response?.data || err);

      alert("Failed to add destination");

    }
  };

  return (
    <>
      <Navbar />

      <div className={styles.page}>

        <h1>📍 Manage Destinations</h1>

        <form onSubmit={addDestination} className={styles.form}>

          <input
            type="text"
            name="name"
            placeholder="Destination Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <button type="submit" className={styles.btn}>
            Add Destination
          </button>

        </form>

        <h2>Existing Destinations</h2>

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
              <tr>
                <td colSpan="3">No destinations found</td>
              </tr>
            ) : (
              destinations.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.country}</td>
                  <td>{d.description}</td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>
    </>
  );
};

export default ManageDestinationsPage;
