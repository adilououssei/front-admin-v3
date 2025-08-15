import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getToken = () => localStorage.getItem('token');

// Récupérer les spécialités avec pagination
export const fetchSpecialites = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}/specialites?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data; // { data: [...], page, limit, total, totalPages }
};

export const createSpecialite = async (data) => {
  const response = await axios.post(`${API_URL}/specialites`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const updateSpecialite = async (id, data) => {
  const response = await axios.put(`${API_URL}/specialite/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const deleteSpecialite = async (id) => {
  await axios.delete(`${API_URL}/specialite/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};
