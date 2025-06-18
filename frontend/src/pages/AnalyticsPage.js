import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/AnalyticsPage.css';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/analytics/overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(response.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (!analytics) return <div className="error">No analytics data available.</div>;

  const {
    totalItems = 0,
    totalCategories = 0,
    totalLocations = 0,
    expiringSoonCount = 0,
    categoryCounts = {},
    locationCounts = {},
    costPerDay = {},
  } = analytics;

  const categoryLabels = Object.keys(categoryCounts).filter(label => label !== '');
  const categoryData = Object.values(categoryCounts).filter((_, idx) => categoryLabels[idx] !== '');

  const locationLabels = Object.keys(locationCounts);
  const locationData = Object.values(locationCounts);

  const dailyCostLabels = Object.keys(costPerDay);
  const dailyCostValues = Object.values(costPerDay);

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">Inventory Analytics</h2>
  
      {/* TOP SECTION - Summary + Category Distribution */}
      <div className="top-section">
        <div className="summary-box">
          <div className="summary-grid">
            <div className="summary-card">
              <p className="summary-label">Total Items</p>
              <p className="summary-value">{totalItems}</p>
            </div>
            <div className="summary-card">
              <p className="summary-label">Categories</p>
              <p className="summary-value">{totalCategories}</p>
            </div>
            <div className="summary-card">
              <p className="summary-label">Locations</p>
              <p className="summary-value">{totalLocations}</p>
            </div>
            <div className="summary-card">
              <p className="summary-label">Expiring Soon</p>
              <p className="summary-value">{expiringSoonCount}</p>
            </div>
          </div>
        </div>
  
        <div className="chart-card small-chart">
          <h3 className="chart-title">Category Distribution</h3>
          <Doughnut data={{
  labels: categoryLabels,
  datasets: [{
    data: categoryData,
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
  }],
}} options={{
  plugins: {
    legend: {
      position: 'right', // Place the legend on the right side
    },
  },
}} />
        </div>
      </div>
  
      {/* BOTTOM SECTION - Location Pie + Daily Cost Line */}
      <div className="bottom-section">
        <div className="chart-card small-chart">
          <h3 className="chart-title">Storage Location Distribution</h3>
          <Pie data={{
  labels: locationLabels,
  datasets: [{
    data: locationData,
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#9966FF', '#00B894', '#E17055'],
  }],
}} options={{
  plugins: {
    legend: {
      position: 'right', // Place the legend on the right side
    },
  },
}} />
        </div>
  
        <div className="chart-card small-chart">
          <h3 className="chart-title">Daily Cost Over Time</h3>
          <Line
  data={{
    labels: dailyCostLabels,
    datasets: [{
      label: '₹ / Day',
      data: dailyCostValues,
      borderColor: '#d35400',
      backgroundColor: 'rgba(255, 206, 86, 0.3)',
      pointBackgroundColor: '#c0392b',
      pointBorderColor: '#c0392b',
      pointRadius: 4,
      tension: 0.4,
      fill: true,
    }],
  }}
  options={{
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: false
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹ ${value}`,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time in Days',
        },
      },
    },
  }}
/>
        </div>
      </div>
    </div>
  );
  
};

export default AnalyticsPage;
