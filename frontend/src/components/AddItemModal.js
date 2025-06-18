import React, { useState } from 'react';
import '../styles/AddItemModal.css';
import { CATEGORIES, LOCATIONS } from '../content/constants';

const AddItemForm = ({ onItemAdded, categories, locations }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    location: '',
    quantity: 1,
    cost: '',  // Changed from unit to cost
    expirationDate: '',
    barcode: '',
    notes: '',
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative numbers for quantity and cost
    if ((name === 'quantity' || name === 'cost') && value < 0) {
      return; // Don't update if value is negative
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);
    if (image) formData.append('image', image);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/items/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Item added successfully!');
        onItemAdded(data);
      } else {
        setMessage(data.message || 'Failed to add item');
      }
    } catch (err) {
      setMessage('Error submitting item');
    }
  };

  return (
    <div className="add-item-form-container">
      <h2>Add New Item</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="left-column">
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              onChange={handleChange}
              required
            />
            <select name="location" onChange={handleChange}>
              <option>Select location</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <input
              type="date"
              name="expirationDate"
              onChange={handleChange}
            />
            <input
              type="text"
              name="barcode"
              placeholder="Barcode"
              onChange={handleChange}
            />
          </div>
          <div className="right-column">
            <select name="category" onChange={handleChange}>
              <option>Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              onChange={handleChange}
            />
            {/* Changed unit to cost */}
            <input
              type="number"
              name="cost"
              placeholder="Cost (in currency)"
              onChange={handleChange}
            />
            <textarea
              name="notes"
              placeholder="Notes"
              onChange={handleChange}
            ></textarea>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>
        <div className="button-group">
          <button type="submit">Add Item</button>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;
