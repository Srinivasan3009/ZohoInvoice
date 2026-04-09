import React, { useEffect, useState } from "react";
import "./invoices.css";

const API_URL = "http://localhost:8080/backend-1.0-SNAPSHOT/api/items";

const Items = () => {
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    price: ""
  });

  const loadItems = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Load Error:", err);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(API_URL, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert(isEditing ? "Item Updated!" : "Item Added!");
        resetForm();
        loadItems();
      } else {
        const errorData = await res.json();
        alert("Error: " + (errorData.message || "Action failed"));
      }
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(`${API_URL}?id=${id}`, {
          method: "DELETE"
        });

        if (res.ok) {
          loadItems();
        } else {
          const errorData = await res.json();
          alert(errorData.message || "Cannot delete item. It is linked to an invoice.");
        }
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ id: null, name: "", description: "", price: "" });
    setIsEditing(false);
  };

  return (
    <div className="container">
      <div className="form-section">
        <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="field">
              <label>Product Name</label>
              <input name="name" placeholder="e.g. Laptop" value={form.name} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Description</label>
              <input name="description" placeholder="Short details..." value={form.description} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <div className="field">
              <label>Price (₹)</label>
              <input name="price" type="number" step="0.01" placeholder="0.00" value={form.price} onChange={handleChange} required />
            </div>

          </div>

          <div className="form-footer">
            <button type="submit" className={isEditing ? "btn-edit" : "btn-submit"}>
              {isEditing ? "Update Item" : "Save Item"}
            </button>
            {isEditing && (
              <button type="button" className="btn-cancel" onClick={resetForm} style={{ marginLeft: "10px", background: "#6c757d", color: "white" }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="list-section">
        <h2>Current Inventory</h2>
        <table className="invoice-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Info</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <strong>{item.name}</strong><br />
                    <small style={{ color: "#777" }}>{item.description}</small>
                  </td>
                  <td>₹ {parseFloat(item.price).toFixed(2)}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(item.id)} style={{ marginLeft: "5px" }}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No items found in inventory.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Items;