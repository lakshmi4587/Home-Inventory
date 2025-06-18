// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddItemModal from "./components/AddItemModal";
import ViewInventoryPage from "./pages/ViewInventoryPage";
import DashboardLayout from "./components/DashboardLayout";
import NotificationsPage from "./pages/NotificationsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected routes inside Dashboard Layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route
            path="add-item"
            element={
              <AddItemModal
                show={true}
                onClose={() => {}}
                onItemAdded={() => {}}
              />
            }
          />
          <Route path="inventory" element={<ViewInventoryPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Redirect /items to /dashboard */}
        <Route path="/items" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
