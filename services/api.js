import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; //this is the backend url

export const sendMessageToAI = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, { message });
    return response.data;
  } catch (error) {
    console.error('Error communicating with the AI:', error);
    throw error;
  }
};