import React from "react";
import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
  const sidebarWidth = "200px";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      <div
        style={{
          width: sidebarWidth,
          background: "#1e293b",
          color: "white",
          padding: "20px",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          boxSizing: "border-box"
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "30px" }}>ZOHO Invoice</h2>

        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={liStyle}><Link to="/dashboard" style={linkStyle}>Dashboard</Link></li>
            <li style={liStyle}><Link to="/dashboard/items" style={linkStyle}>Items</Link></li>
            <li style={liStyle}><Link to="/dashboard/customers" style={linkStyle}>Customers</Link></li>
            <li style={liStyle}><Link to="/dashboard/invoices" style={linkStyle}>Invoices</Link></li>
          </ul>
        </nav>
      </div>

      <div style={{
        flex: 1,
        background: "#f1f5f9",
        marginLeft: sidebarWidth,
        minHeight: "100vh"
      }}>

        <div
          style={{
            height: "60px",
            background: "white",
            display: "flex",
            alignItems: "center",
            paddingLeft: "20px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            position: "sticky",
            top: 0,
            zIndex: 10
          }}
        >
          <h3 style={{ margin: 0 }}>System Overview</h3>
        </div>

        <div style={{ padding: "30px" }}>
          <Outlet />
        </div>

      </div>
    </div>
  );
};

const liStyle = {
  marginBottom: "15px"
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
  display: "block",
  padding: "10px",
  borderRadius: "4px",
  transition: "background 0.2s"
};

export default Dashboard;