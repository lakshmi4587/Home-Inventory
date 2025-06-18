// src/components/EditProfileForm.js
import React, { useState } from 'react';
import axios from 'axios';

const EditProfileForm = ({ currentEmail, currentName, onCancel, onUpdate }) => {
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (newPassword && !currentPassword) {
      alert('Please enter your current password to change your password.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/profile',
        {
          name,
          email,
          currentPassword: currentPassword || null,
          newPassword: newPassword || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Profile updated successfully!');
      onUpdate();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };
  
  

  return (
    <div className="edit-profile-form">
      {/* <h3>Edit Profile</h3> */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
  <label htmlFor="currentPassword">Current Password:</label>
  <input
    type="password"
    id="currentPassword"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    placeholder="Only required when changing password"
  />
</div>
<div className="form-group">
  <label htmlFor="newPassword">New Password:</label>
  <input
    type="password"
    id="newPassword"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    placeholder="Leave blank if not changing"
  />
</div>

<div className="form-actions">
  <button type="submit" className="update-btn">Update</button>
  <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
</div>

      </form>
    </div>
  );
};

export default EditProfileForm;
