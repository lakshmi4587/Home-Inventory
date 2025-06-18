import axios from "axios";

const API_URL = "http://localhost:5000";

export const getItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/getdata`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

export const addItem = async (item) => {
  try {
    const response = await axios.post(`${API_URL}/add-item`, item);
    return response.data;
  } catch (error) {
    console.error("Error adding item:", error);
    return null;
  }
};
