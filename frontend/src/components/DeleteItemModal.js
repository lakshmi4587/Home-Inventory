// DeleteItemModal.js
import React from "react";
import "../styles/DeleteItemModal.css";
const DeleteItemModal = ({ item, onDelete, onClose }) => {
  const handleDelete = () => {
    onDelete(item._id); // Call the onDelete function passed from parent to delete the item
    onClose(); // Close the modal after deletion
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Are you sure you want to delete "{item.name}"?</h3>
        <div className="modal-buttons">
          <button onClick={handleDelete} className="confirm-btn">
            Yes, Delete
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteItemModal;
