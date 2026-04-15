import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/backend-1.0-SNAPSHOT/api";

const Card = ({ title, value, color }) => (
  <div
    style={{
      background: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      flex: "1",
      minWidth: "220px",
      borderLeft: `5px solid ${color}`,
    }}
  >
    <h4 style={{ color: "#888", marginBottom: "10px", fontSize: "14px", textTransform: "uppercase" }}>
      {title}
    </h4>
    <h2 style={{ color: "#333", margin: "0", fontSize: "32px" }}>{value}</h2>
  </div>
);

const Home = () => {
  const [counts, setCounts] = useState({ items: 0, customers: 0, invoices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
const userId = localStorage.getItem("userId");
    Promise.all([
      fetch(`${API}/items?userId=${userId}`).then((res) => res.json()),
      fetch(`${API}/customers?userId=${userId}`).then((res) => res.json()),
      fetch(`${API}/invoices?userId=${userId}`).then((res) => res.json()),
    ])
      .then(([items, customers, invoices]) => {
        setCounts({
          items: items.length,
          customers: customers.length,
          invoices: invoices.length,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard counts:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "40px", width: "100%", boxSizing: "border-box" }}>
      <header style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#1a2332", margin: "0" }}>Business Overview </h2>

      </header>

      <div
        style={{
          display: "flex",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <Card title="Total Items" value={loading ? "..." : counts.items} color="#007bff" />
        <Card title="Active Customers" value={loading ? "..." : counts.customers} color="#28a745" />
        <Card title="Invoices Issued" value={loading ? "..." : counts.invoices} color="#ffc107" />
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3 style={{ color: "#1a2332", marginBottom: "20px" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            style={{ padding: "12px 20px", borderRadius: "8px", border: "none", backgroundColor: "#1a2332", color: "white", cursor: "pointer" }}
            onClick={() => window.location.href='/dashboard/invoices'}
          >
            + Create New Invoice
          </button>
          <button
            style={{ padding: "12px 20px", borderRadius: "8px", border: "1px solid #ccc", backgroundColor: "white", cursor: "pointer" }}
            onClick={() => window.location.href='/dashboard/items'}
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;