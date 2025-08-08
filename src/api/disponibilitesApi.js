import axios from './axiosInstance';

const BASE_URL = '/disponibilites';

export const getDisponibilites = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createDisponibilite = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const updateDisponibilite = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteDisponibilite = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

// Ajout de la fonction saveDisponibilite
export const saveDisponibilite = async (data) => {
  if (data.id) {
    return updateDisponibilite(data.id, data);
  } else {
    return createDisponibilite(data);
  }
};
