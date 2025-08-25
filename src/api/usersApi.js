// src/api/usersApi.js
import axios from 'axios';

// const BASE_URL = 'http://localhost:8000/api/users';
const BASE_URL = 'https://myhospital.archipel-dutyfree.com/api/users';

// Fonction utilitaire pour ajouter le token dans les headers
const authHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const fetchUsers = async () => {
  const response = await axios.get(BASE_URL, authHeader());
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(BASE_URL, userData, authHeader());
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, userData, authHeader());
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, authHeader());
  return response.data;
};
