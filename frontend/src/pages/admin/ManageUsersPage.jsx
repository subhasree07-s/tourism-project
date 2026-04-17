import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axiosInstance";
import styles from "./AdminPages.module.css";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // ✅ LOAD USERS (ONLY NORMAL USERS)
  // ===============================
  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/users");

      if (res.data?.success) {
        // 🔥 FILTER OUT ADMINS
        const filteredUsers = res.data.data.filter(
          (u) => u.role !== "admin"
        );

        setUsers(filteredUsers);
      } else {
        setUsers([]);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ===============================
  // UI
  // ===============================
  return (
    <>
      <Navbar />

      <div className={styles.page}>
        <h1>👤 Registered Users</h1>

        {/* LOADING */}
        {loading && <p>Loading...</p>}

        {/* ERROR */}
        {!loading && error && (
          <p style={{ color: "orange" }}>{error}</p>
        )}

        {/* TABLE */}
        {!loading && !error && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ textAlign: "center" }} >{u.name}</td>
                    <td style={{ textAlign: "center" }}>{u.email}</td>
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

export default ManageUsersPage;