// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:8000/api',
  baseURL: 'https://myhospital.archipel-dutyfree.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajoute automatiquement le token JWT si disponible
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
