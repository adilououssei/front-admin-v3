// src/api/specialitesApi.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getToken = () => {
  return localStorage.getItem('token'); // ou sessionStorage.getItem('token') selon où tu le stockes
};

export const fetchSpecialites = async () => {
  const response = await axios.get(`${API_URL}/specialites`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

export const createSpecialite = async (data) => {
  const response = await axios.post(`${API_URL}/specialites`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};
export const updateSpecialite = async (id, data) => {
  const response = await axios.put(`${API_URL}/specialite/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

export const deleteSpecialite = async (id) => {
  await axios.delete(`${API_URL}/specialite/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};
