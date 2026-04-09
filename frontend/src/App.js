import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Customers from "./pages/Customers";
import Invoices from "./pages/Invoices";
import InvoiceView from "./pages/InvoiceView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="items" element={<Items />} />
          <Route path="customers" element={<Customers />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="/dashboard/invoices/view/:id" element={<InvoiceView />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;