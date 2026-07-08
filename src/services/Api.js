import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const getNewArrivals = () =>
  API.get('/products?isNewArrival=true');

export const getProducts = (params) =>
  API.get(`/products?${params}`);

export const sendContactMessage = (data) =>
  API.post('/messages/createMessage', data);

export default API;