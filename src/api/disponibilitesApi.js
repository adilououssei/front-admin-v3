import axios from './axiosInstance';

const BASE_URL = '/disponibilites';

// GET : récupérer les disponibilités d’un docteur
export const getDisponibilites = async (docteurId) => {
  const response = await axios.get(`${BASE_URL}?docteur=${docteurId}`);
  return response.data;
};

// POST : créer une nouvelle disponibilité
export const createDisponibilite = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

// PUT : mettre à jour une disponibilité existante
export const updateDisponibilite = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

// DELETE : supprimer une disponibilité
export const deleteDisponibilite = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

// Fonction pratique pour sauvegarder (create ou update)
export const saveDisponibilite = async (data) => {
  if (data.id) {
    return updateDisponibilite(data.id, data);
  } else {
    return createDisponibilite(data);
  }
};
