import axios from 'axios';

// Configure base URL - adjust this to match your backend URL
const API_BASE_URL = 'http://localhost:3333'; // Change this to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
