// src/components/ProfileDropdown.js
import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import EditProfileForm from './EditProfileForm';
import axios from 'axios';
import '../styles/ProfileDropdown.css';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [user, setUser] = useState(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const closeModals = () => {
    setShowProfilePopup(false);
    setShowEditPopup(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-icon-wrapper" onClick={toggleDropdown}>
        <FaUserCircle className="profile-icon" />
        <span className="username">{user?.name?.toLowerCase()}</span>
        <span className="arrow">▼</span>
      </div>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-links">
            <button onClick={() => setShowProfilePopup(true)}>👤 Profile</button>
            <button onClick={() => setShowEditPopup(true)}>✏️ Edit Profile</button>
            <button onClick={handleLogout}>🚪 Logout</button>
          </div>

          {showProfilePopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h3>👤 Profile</h3>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <button onClick={closeModals}>Close</button>
              </div>
            </div>
          )}

          {showEditPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h3>Edit Profile</h3>
                <EditProfileForm
                  currentEmail={user?.email}
                  currentName={user?.name}
                  onCancel={closeModals}
                  onUpdate={() => {
                    fetchUserProfile();
                    closeModals();
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
