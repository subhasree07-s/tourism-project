import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axiosInstance";
import styles from "./AdminPages.module.css";

const ManagePackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    image: "",
    duration: "",
    price: "",
    description: "",
    transportation: "",
    sightseeing: "",
    meals: "",
    itinerary: "",
  });

  const [hotels, setHotels] = useState([
    { name: "", pricePerDay: "", description: "", image: "" },
  ]);

  useEffect(() => {
    loadPackages();
    loadDestinations();
  }, []);

  const loadPackages = async () => {
    try {
      const res = await api.get("/packages");
      setPackages(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDestinations = async () => {
    try {
      const res = await api.get("/destinations");
      setDestinations(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FIXED CHANGE HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ HOTEL CHANGE
  const handleHotelChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...hotels];
    updated[index][name] = value;

    setHotels(updated);
  };

  const addHotel = () => {
    setHotels([
      ...hotels,
      { name: "", pricePerDay: "", description: "", image: "" },
    ]);
  };

  // ✅ EDIT
  const handleEdit = async (id) => {
    try {
      const res = await api.get(`/packages/${id}`);
      const pkg = res.data.data;

      setEditingId(id);

      setFormData({
        name: pkg.name || "",
        destination:
          typeof pkg.destination === "object"
            ? pkg.destination?._id
            : pkg.destination || "",
        image: pkg.image || "",
        duration: pkg.duration || "",
        price: pkg.price || "",
        description: pkg.description || "",
        transportation: (pkg.transportation || []).join(","),
        sightseeing: (pkg.sightseeing || []).join(","),
        meals: (pkg.meals || []).join(","),
        itinerary: (pkg.itinerary || []).join(","),
      });

      setHotels(pkg.hotels?.length ? pkg.hotels : [
        { name: "", pricePerDay: "", description: "", image: "" },
      ]);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete package?")) return;

    try {
      await api.delete(`/packages/${id}`);
      loadPackages();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FIXED SUBMIT (IMPORTANT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      destination: formData.destination,
      image: formData.image, // ✅ CRITICAL FIX
      duration: formData.duration,
      price: Number(formData.price),
      description: formData.description,

      transportation: formData.transportation
        ? formData.transportation.split(",").map(i => i.trim())
        : [],

      sightseeing: formData.sightseeing
        ? formData.sightseeing.split(",").map(i => i.trim())
        : [],

      meals: formData.meals
        ? formData.meals.split(",").map(i => i.trim())
        : [],

      itinerary: formData.itinerary
        ? formData.itinerary.split(",").map(i => i.trim())
        : [],

      hotels: hotels.map((h) => ({
        name: h.name,
        pricePerDay: Number(h.pricePerDay),
        description: h.description,
        image: h.image, // ✅ HOTEL IMAGE
      })),
    };

    console.log("FINAL PAYLOAD:", payload); // 🔥 DEBUG

    try {
      if (editingId) {
        await api.put(`/packages/${editingId}`, payload);
        alert("Updated!");
      } else {
        await api.post("/packages", payload);
        alert("Added!");
      }

      // RESET
      setEditingId(null);

      setFormData({
        name: "",
        destination: "",
        image: "",
        duration: "",
        price: "",
        description: "",
        transportation: "",
        sightseeing: "",
        meals: "",
        itinerary: "",
      });

      setHotels([{ name: "", pricePerDay: "", description: "", image: "" }]);

      loadPackages();

    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      alert("Error saving package");
    }
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.heading}>✈️ Manage Packages</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.layout}>

            {/* LEFT */}
            <div className={styles.left}>
              <input name="name" placeholder="Package Name" value={formData.name} onChange={handleChange} />

              <select name="destination" value={formData.destination} onChange={handleChange}>
                <option value="">Select Destination</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>

              {/* ✅ IMAGE FIELD */}
              <input
                name="image"
                placeholder="Paste Package Image URL"
                value={formData.image}
                onChange={handleChange}
              />

              <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} />
              <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />

              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
              <textarea name="transportation" placeholder="Transportation" value={formData.transportation} onChange={handleChange} />
              <textarea name="sightseeing" placeholder="Sightseeing" value={formData.sightseeing} onChange={handleChange} />
              <textarea name="meals" placeholder="Meals" value={formData.meals} onChange={handleChange} />
              <textarea name="itinerary" placeholder="Itinerary" value={formData.itinerary} onChange={handleChange} />

              <button className={styles.submitBtn}>
                {editingId ? "Update Package" : "Add Package"}
              </button>
            </div>

            {/* RIGHT */}
            <div className={styles.right}>
              <h3>🏨 Add Hotels</h3>

              {hotels.map((hotel, index) => (
                <div key={index} className={styles.hotelCard}>
                  <input name="name" placeholder="Hotel Name" value={hotel.name} onChange={(e) => handleHotelChange(index, e)} />
                  <input name="pricePerDay" type="number" placeholder="Price per day" value={hotel.pricePerDay} onChange={(e) => handleHotelChange(index, e)} />

                  <input
                    name="image"
                    placeholder="Hotel Image URL"
                    value={hotel.image}
                    onChange={(e) => handleHotelChange(index, e)}
                  />

                  <textarea name="description" placeholder="Hotel Description" value={hotel.description} onChange={(e) => handleHotelChange(index, e)} />
                </div>
              ))}

              <button type="button" onClick={addHotel} className={styles.addHotelBtn}>
                ➕ Add Another Hotel
              </button>
            </div>

          </div>
        </form>

        {/* TABLE */}
        <div className={styles.tableSection}>
          <h2>📦 Package History</h2>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Destination</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Hotels</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(packages) && packages.map((pkg) => (
                <tr key={pkg._id}>
                  <td>{pkg.name}</td>
                  <td>{pkg.destination?.name || "—"}</td>
                  <td>{pkg.duration}</td>
                  <td>₹{pkg.price}</td>
                  <td>{pkg.hotels?.length || 0}</td>

                  <td>
                    <button onClick={() => handleEdit(pkg._id)}>✏️</button>
                    <button onClick={() => handleDelete(pkg._id)} style={{ marginLeft: "10px", background: "red", color: "white" }}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </>
  );
};

export default ManagePackagesPage;