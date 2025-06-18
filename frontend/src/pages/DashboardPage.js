import React, { useEffect, useState } from 'react';
import API from '../utils/api'; // Use your shared axios instance
import ProfileDropdown from '../components/ProfileDropdown';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalItems: 0,
    lowStockItems: 0,
    expiringSoonItems: 0,
    expiredItems: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, notificationsRes] = await Promise.all([
          API.get('/dashboard'),
          API.get('/notifications'),
        ]);

        setDashboardData(dashboardRes.data);
        setNotifications(notificationsRes.data.slice(0, 5)); // show top 5
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome to HomeHive</h1>
      <p>Smart home inventory management made easy.</p>

      {/* Profile Dropdown */}
      <ProfileDropdown />

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="dashboard-stats-container">
          {/* Stats Column */}
          <div className="stats-column">
            <div className="stat-box">
              <h3>Total Items</h3>
              <p>{dashboardData.totalItems}</p>
            </div>
            <div className="stat-box">
              <h3>Low Stock Items</h3>
              <p>{dashboardData.lowStockItems}</p>
            </div>
            <div className="stat-box">
              <h3>Expiring Soon Items</h3>
              <p>{dashboardData.expiringSoonItems}</p>
            </div>
            <div className="stat-box">
              <h3>Expired Items</h3>
              <p>{dashboardData.expiredItems}</p>
            </div>
          </div>

          {/* Notifications Widget */}
          <div className="recent-alerts">
            <h3>Recent Notifications</h3>
            <ul>
              {notifications.length === 0 ? (
                <li>No notifications</li>
              ) : (
                notifications.map((notif, index) => (
                  <li key={index} className="alert bg-yellow-100 p-2 rounded mb-1">
                    {notif.message}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
