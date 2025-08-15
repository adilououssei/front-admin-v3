// src/api/doctorsApi.js
import axios from './axiosInstance'; // utilise l'instance avec token

const BASE_URL = '/docteurs'; // le préfixe déjà dans axiosInstance
const getToken = () => localStorage.getItem('token');

// Récupérer la liste des docteurs avec pagination
export const getDocteurs = async (page = 1, limit = 10) => {
  const response = await axios.get(`${BASE_URL}?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

// Créer un nouveau docteur
export const createDocteur = async (docteurData) => {
  const response = await axios.post(BASE_URL, docteurData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

// Mettre à jour un docteur existant
export const updateDocteur = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

// Supprimer un docteur
export const deleteDocteur = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};
