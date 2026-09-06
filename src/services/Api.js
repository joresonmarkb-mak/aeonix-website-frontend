import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

//import.meta.env.VITE_API_URL || 

export const getNewArrivals = () =>
  API.get('/products', { params: { isNewArrival: true } });

export const getProducts = (params) =>
  API.get('/products', { params });

export const sendContactMessage = (data) =>
  API.post('/messages/createMessage', data);

export default API;