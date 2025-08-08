// src/api/doctorsApi.js
import axios from './axiosInstance'; // utilise l'instance avec token

const BASE_URL = '/docteurs'; // car le prefix de base est déjà dans axiosInstance

export const getDoctors = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await axios.post('/docteur', doctorData); // attention route différente
  return response.data;
};

export const deleteDoctor = async (id) => {
  const response = await axios.delete(`/docteur/${id}`);
  return response.data;
};
