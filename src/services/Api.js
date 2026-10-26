
import axios from 'axios';

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

// Get new arrivals
export const getNewArrivals = () =>
  API.get('/products', {
    params: { isNewArrival: true },
  });

// Get products
export const getProducts = (params) =>
  API.get('/products', { params });

// Send contact message
export const sendContactMessage = (data) =>
  API.post('/messages/createMessage', data);

export default API;
