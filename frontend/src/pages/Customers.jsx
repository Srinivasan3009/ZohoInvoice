import React, { useEffect, useState } from "react";
import "./invoices.css";

const API = "http://localhost:8080/backend-1.0-SNAPSHOT/api/customers";

const Customers = () => {
    const userId = localStorage.getItem("userId");
  const [customers, setCustomers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    userId: userId
  });
  const fetchCustomers = async () => {
    try {
    const currentId = localStorage.getItem("userId");
    const res = await fetch(`${API}?userId=${currentId}`);
    const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(API, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert(isEditing ? "Customer Updated!" : "Customer Added!");
        resetForm();
        fetchCustomers();
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const res = await fetch(`${API}?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchCustomers();
        } else {
          alert("Cannot delete customer. They might have active invoices.");
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const editCustomer = (c) => {
      const userId = localStorage.getItem("userId");
    setForm({   ...c,
                userId: userId
              });
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
      const userId = localStorage.getItem("userId");
    setForm({ id: null, name: "", email: "", phone: "", address: "" ,userId: userId});
    setIsEditing(false);
  };

  return (
    <div className="container">
      <div className="form-section">
        <h2>{isEditing ? "Edit Customer" : "Add New Customer"}</h2>
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="input-group">
              <div className="field">
               <label>Name</label>
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="field">
             <label>Email ID</label>
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="input-group">
              <div className="field">
               <label>Phone Number </label>
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="field">
             <label>Address </label>
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className={isEditing ? "btn-edit" : "btn-submit"}>
              {isEditing ? "Update Customer" : "Save Customer"}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} style={{ marginLeft: "10px" }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="list-section">
        <h2>Customer Directory</h2>
        <table className="invoice-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td><strong>{c.name}</strong></td>
                <td>
                  <div>{c.email}</div>
                  <small style={{ color: "#666" }}>{c.phone}</small>
                </td>
                <td>{c.address}</td>
                <td>
                  <button className="btn-edit" onClick={() => editCustomer(c)}>Edit</button>
                  <button className="btn-delete" onClick={() => deleteCustomer(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;