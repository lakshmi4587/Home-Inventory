import React, { useEffect, useState } from 'react';
import API from '../utils/api'; // <-- use custom axios instance
import '../styles/ViewInventoryPage.css';
import EditItemModal from '../components/EditItemModal';
import DeleteItemModal from '../components/DeleteItemModal';

const ViewInventoryPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    API.get('/items')
      .then((res) => {
        const fetchedItems = res.data;
        setItems(fetchedItems);
        setFilteredItems(fetchedItems);

        const uniqueCategories = [...new Set(fetchedItems.map(item => item.category))];
        const uniqueLocations = [...new Set(fetchedItems.map(item => item.location))];
        setCategories(uniqueCategories);
        setLocations(uniqueLocations);
      })
      .catch((err) => {
        console.error('Error fetching items:', err);
      });
  };

  useEffect(() => {
    const filtered = items.filter(item => {
      const categoryMatch = categoryFilter ? item.category === categoryFilter : true;
      const locationMatch = locationFilter ? item.location === locationFilter : true;
      return categoryMatch && locationMatch;
    });
    setFilteredItems(filtered);
  }, [categoryFilter, locationFilter, items]);

  const handleDelete = async (itemId) => {
    try {
      await API.delete(`/items/${itemId}`);
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setModalVisible(true);
  };

  const handleSaveChanges = async (updatedItem) => {
    try {
      await API.put(`/items/${updatedItem._id}`, updatedItem);
      fetchItems();
      setSuccessMessage(`Item "${updatedItem.name}" updated successfully.`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleRecommend = (item) => {
    // Check the category of the item and redirect accordingly
    const recommendationUrl = item.category.toLowerCase() === 'electronics' 
      ? `https://www.amazon.com/s?k=${item.name.replace(' ', '+')}&s=review-rank`
      : `https://www.bigbasket.com/ps/?q=${item.name.replace(' ', '+')}`;

    // Redirect to the respective shopping page for the user to shop for that product
    window.open(recommendationUrl, '_blank');
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalVisible(false);
    setDeleteItem(null);
  };

  return (
    <div className="inventory-container">
      <h2>Inventory</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="filter-section-row">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="inventory-grid">
        {filteredItems.length === 0 ? (
          <p>No items found.</p>
        ) : (
          filteredItems.map((item) => (
            <div className="inventory-card" key={item._id}>
              <div className="card-top-buttons">
                <button onClick={() => handleEdit(item)} className="edit-btn">✏️</button>
                <button onClick={() => { setDeleteItem(item); setDeleteModalVisible(true); }} className="delete-btn">🗑️</button>
              </div>

              <div className="inventory-details">
                <h3>{item.name}</h3>
                <div className="tags">
                  <span className="tag">{item.category}</span>
                  <span className="tag">{item.location}</span>
                </div>
                <p><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
                {item.expirationDate && (
                  <p><strong>Expires on:</strong> {new Date(item.expirationDate).toLocaleDateString()}</p>
                )}
                {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
              </div>

              <button onClick={() => handleRecommend(item)} className="replace-btn">🔁 Recommend for Shopping</button>
            </div>
          ))
        )}
      </div>

      {modalVisible && (
        <EditItemModal 
          item={editItem} 
          categories={categories} 
          locations={locations} 
          onSave={handleSaveChanges} 
          onClose={handleModalClose}
        />
      )}

      {deleteModalVisible && (
        <DeleteItemModal 
          item={deleteItem} 
          onDelete={handleDelete} 
          onClose={handleDeleteModalClose}
        />
      )}
    </div>
  );
};

export default ViewInventoryPage;
