import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const fetchNotifications = async () => {
  const response = await API.get('/notifications');
  return response.data;
};

// utils/api.js (or wherever your API functions are defined)

// utils/api.js (or wherever your API functions are defined)

// utils/api.js

export const markNotificationAsRead = async (id) => {
  console.log('Sending request to mark notification as read:', id); // Debugging log

  const response = await API.patch(`/notifications/${id}/read`);

  console.log('Updated Notification:', response.data); // Debugging log

  return response.data;
};




export default API;
