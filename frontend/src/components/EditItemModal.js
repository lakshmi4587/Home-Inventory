import React, { useState, useEffect } from 'react';
import '../styles/EditItemModal.css';
import { CATEGORIES, LOCATIONS } from '../content/constants';

const EditItemModal = ({ item, categories, locations, onSave, onClose }) => {
  const [editItem, setEditItem] = useState(item);
  const [image, setImage] = useState(null);

  useEffect(() => {
    setEditItem(item);
  }, [item]);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    for (let key in editItem) {
      formData.append(key, editItem[key]);
    }
    if (image) formData.append('image', image);
  
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch(`http://localhost:5000/api/items/${editItem._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Only this header, do NOT add Content-Type
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        onSave(data);
      } else {
        console.error('Update failed:', data);
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error updating item');
    }
  };
  

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Item</h3>
        <div className="modal-close" onClick={onClose}>✖️</div>
        <form>
          <div className="modal-row">
            <div>
              <label>Name:</label>
              <input
  type="text"
  value={editItem.name || ''}
  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
/>

            </div>
            <div>
              <label>Category:</label>
              <select
                value={editItem.category}
                onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div>
              <label>Expiration Date:</label>
              <input
                type="date"
                value={editItem.expirationDate}
                onChange={(e) => setEditItem({ ...editItem, expirationDate: e.target.value })}
              />
            </div>
            <div>
              <label>Location:</label>
              <select
                value={editItem.location}
                onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div>
              <label>Quantity:</label>
              <input
                type="number"
                value={editItem.quantity}
                onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
              />
            </div>
            {/* Replaced unit with cost */}
            <div>
              <label>Cost (in currency):</label>
              <input
                type="number"
                value={editItem.cost}
                onChange={(e) => setEditItem({ ...editItem, cost: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-row">
            <div>
              <label>Barcode:</label>
              <input
                type="text"
                value={editItem.barcode}
                onChange={(e) => setEditItem({ ...editItem, barcode: e.target.value })}
              />
            </div>
            <div>
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>

          <div>
            <label>Notes:</label>
            <textarea
              value={editItem.notes}
              onChange={(e) => setEditItem({ ...editItem, notes: e.target.value })}
            />
          </div>

          <button type="button" onClick={handleSaveChanges} className="save-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;
