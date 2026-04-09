import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./invoices.css";

const API = "http://localhost:8080/backend-1.0-SNAPSHOT/api";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    fetch(`${API}/invoices?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Invoice Data Loaded:", data);
        setInvoice(data);
      })
      .catch((err) => console.error("Error fetching invoice:", err));
  }, [id]);

  if (!invoice) {
    return (
      <div className="container">
        <div className="loading">Loading Invoice Details...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="invoice-card">
        <div className="invoice-header">
          <div>
            <h1>INVOICE</h1>
            <p className="invoice-id">Reference: #00{invoice.id}</p>
          </div>
          <button className="btn-cancel" onClick={() => navigate("/dashboard/invoices")}>
            Back to List
          </button>
        </div>

        <div className="invoice-details-grid">
          <div className="info-block">
            <h4>Customer Information</h4>
            <p><strong>Customer ID:</strong> {invoice.customerId}</p>
          </div>
          <div className="info-block" style={{ textAlign: "right" }}>
            <h4>Payment Summary</h4>
            <p><strong>Status:</strong> <span className="status-paid">Processed</span></p>
          </div>
        </div>

        <table className="invoice-list" style={{ marginTop: "30px" }}>
          <thead>
            <tr>
              <th>Item ID</th>
              <th style={{ textAlign: "right" }}>Unit Price</th>
              <th style={{ textAlign: "center" }}>Quantity</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.rows && invoice.rows.map((row, index) => (
              <tr key={index}>
                <td>Product #{row.itemId}</td>
                <td style={{ textAlign: "right" }}>₹ {row.price.toLocaleString()}</td>
                <td style={{ textAlign: "center" }}>{row.qty}</td>
                <td style={{ textAlign: "right" }}>
                  ₹ {(row.price * row.qty).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-footer">
          <div className="total-section">
            <p>Subtotal: ₹ {invoice.totalAmount.toLocaleString()}</p>
            <p>Tax (0%): ₹ 0.00</p>
            <h2 className="grand-total">
              Grand Total: ₹ {invoice.totalAmount.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;