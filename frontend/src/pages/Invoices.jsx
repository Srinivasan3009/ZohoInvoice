import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./invoices.css";

const API = "http://localhost:8080/backend-1.0-SNAPSHOT/api";

const Invoices = () => {
    const userId = localStorage.getItem("userId");
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [invoice, setInvoice] = useState({
    id: null,
    customerId: "",
    rows: []
  });
const navigate = useNavigate();
  useEffect(() => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      navigate("/login");
      return;
    }
    fetch(`${API}/customers?userId=${currentUserId}`).then(res => res.json()).then(setCustomers);
    fetch(`${API}/items?userId=${currentUserId}`).then(res => res.json()).then(setItems);
    fetchInvoices(currentUserId);
  }, []);

  const fetchInvoices = (uid) => {
    const idToUse = uid || localStorage.getItem("userId");
    fetch(`${API}/invoices?userId=${idToUse}`)
      .then(res => res.json())
      .then(setInvoices)
      .catch(err => console.error(err));
  };

  const addRow = () => {
    setInvoice({
      ...invoice,
      rows: [...invoice.rows, { itemId: "", price: 0, qty: 1 }]
    });
  };

  const removeRow = (index) => {
    const updated = [...invoice.rows];
    updated.splice(index, 1);
    setInvoice({ ...invoice, rows: updated });
  };

  const updateRow = (index, field, value) => {
    const updated = [...invoice.rows];
    updated[index][field] = value;
    if (field === "itemId") {
      const item = items.find(i => i.id == value);
      if (item) updated[index].price = item.price;
    }
    setInvoice({ ...invoice, rows: updated });
  };

  const grandTotal = invoice.rows.reduce((sum, r) => sum + r.price * r.qty, 0);

  const handleSubmit = async () => {
      const currentUserId = localStorage.getItem("userId");
        const payload = {
          ...invoice,
          userId: currentUserId,
          totalAmount: grandTotal
        };
    const method = isEditing ? "PUT" : "POST";
    const response = await fetch(`${API}/invoices`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert(isEditing ? "Invoice Updated!" : "Invoice Created!");
      setInvoice({ id: null, customerId: "", rows: [] });
      setIsEditing(false);
      fetchInvoices(currentUserId);
    }
  };

  // DELETE
  const deleteInvoice = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const response = await fetch(`${API}/invoices?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchInvoices();
      }
    }
  };

  const editInvoice = async (invSummary) => {
    try {
    const res = await fetch(`${API}/invoices?id=${invSummary.id}`);
        const fullData = await res.json();
   setInvoice({
         id: fullData.id,
         customerId: fullData.customerId,
         rows: fullData.rows
       });

       setIsEditing(true);
       window.scrollTo({ top: 0, behavior: 'smooth' });
     } catch (err) {
       console.error("Error fetching invoice details:", err);
       alert("Could not load invoice details.");
     }
  };

  return (
    <div className="container">
      <div className="form-section">
        <h2>{isEditing ? "Edit Invoice" : "Create New Invoice"}</h2>
        <div className="customer-select">
            <label>Customer:</label>
            <select
                value={invoice.customerId}
                onChange={(e) => setInvoice({ ...invoice, customerId: e.target.value })}
            >
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoice.rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <select value={row.itemId} onChange={(e) => updateRow(index, "itemId", e.target.value)}>
                    <option value="">Select Item</option>
                    {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </td>
                <td>₹ {row.price}</td>
                <td>
                  <input type="number" value={row.qty} onChange={(e) => updateRow(index, "qty", Number(e.target.value))} />
                </td>
                <td>₹ {row.price * row.qty}</td>
                <td><button className="btn-remove" onClick={() => removeRow(index)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="form-footer">
            <button className="btn-add" onClick={addRow}>+ Add Item</button>
            <h3>Total: ₹ {grandTotal}</h3>
            <button className="btn-submit" onClick={handleSubmit}>
              {isEditing ? "Update Invoice" : "Save Invoice"}
            </button>
            {isEditing && <button onClick={() => {setIsEditing(false); setInvoice({id:null, customerId:"", rows:[]})}}>Cancel</button>}
        </div>
      </div>

      <hr />

      <div className="list-section">
        <h2>Recent Invoices</h2>
        <table className="invoice-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.customerName}</td>
                <td>{inv.invoiceDate}</td>
                <td>₹ {inv.totalAmount}</td>
                <td>
                    <button className="btn-view" onClick={() => navigate(`/dashboard/invoices/view/${inv.id}`)}>
                        View
                      </button>
                  <button className="btn-edit" onClick={() => editInvoice(inv)}>Edit</button>
                  <button className="btn-delete" onClick={() => deleteInvoice(inv.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;