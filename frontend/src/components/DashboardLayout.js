// src/components/DashboardLayout.js
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../styles/DashboardPage.css'; // You can rename it to DashboardLayout.css if needed

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2 className="logo">🏠 HomeHive</h2>
        <nav className="nav-links">
          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>📊 Dashboard</Link>
          <Link to="/add-item" className={location.pathname === "/add-item" ? "active" : ""}>➕ Add Item</Link>
          <Link to="/inventory" className={location.pathname === "/inventory" ? "active" : ""}>📦 Inventory</Link>
          <Link to="/analytics" className={location.pathname === "/analytics" ? "active" : ""}>📈 Analytics</Link>
          <Link to="/notifications" className={location.pathname === "/notifications" ? "active" : ""}>🔔 Notifications</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
