import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/backend-1.0-SNAPSHOT/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Signup successful! Please login.");
      navigate("/login");
    } else {
      alert("Signup failed.");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2>Create Account</h2>
        <input style={inputStyle} type="text" placeholder="Name" onChange={(e) => setForm({...form, name: e.target.value})} required />
        <input style={inputStyle} type="email" placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} required />
        <input style={inputStyle} type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} required />
        <button style={btnStyle} type="submit">Sign Up</button>
        <p>Already have an account? <span onClick={() => navigate("/login")} style={{cursor: "pointer", color: "#007bff"}}>Login</span></p>
      </form>
    </div>
  );
};

const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f1f5f9" };
const formStyle = { background: "white", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center", width: "350px" };
const inputStyle = { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" };
const btnStyle = { width: "100%", padding: "12px", background: "#1e293b", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };

export default Signup;