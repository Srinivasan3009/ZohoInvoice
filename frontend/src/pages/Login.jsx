import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ email, password });

      if (res.success) {
          localStorage.setItem("userId", res.userId);
          navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

return (
    <div style={styles.container}>
      <div style={styles.box}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={styles.button}>Login</button>
        </form>

        <div style={footerStyle}>
          <p>Don't have an account?
            <span onClick={() => navigate("/signup")} style={linkStyle}> Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
const footerStyle = {
  marginTop: "25px",
  textAlign: "center",
  fontSize: "14px",
  color: "#64748b",
};

const linkStyle = {
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: "600",
  marginLeft: "5px",
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  box: {
    background: "#fff",
    padding: "30px",
    width: "350px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1e293b",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Login;