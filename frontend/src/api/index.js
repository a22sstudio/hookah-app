import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://hookah-app.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== Brands =====
export const getBrands = async () => {
  const { data } = await api.get('/api/brands');
  return data;
};

export const getBrandBySlug = async (slug) => {
  const { data } = await api.get(`/api/brands/${slug}`);
  return data;
};

// ===== Flavors =====
export const getFlavors = async (params = {}) => {
  const { data } = await api.get('/api/flavors', { params });
  return data;
};

export const getFlavorById = async (id) => {
  const { data } = await api.get(`/api/flavors/${id}`);
  return data;
};

// ===== Mixes =====
export const getMixes = async (params = {}) => {
  const { data } = await api.get('/api/mixes', { params });
  return data;
};

export const getMixById = async (id) => {
  const { data } = await api.get(`/api/mixes/${id}`);
  return data;
};

export const createMix = async (mixData) => {
  const { data } = await api.post('/api/mixes', mixData);
  return data;
};

export const mixAction = async (mixId, actionData) => {
  const { data } = await api.post(`/api/mixes/${mixId}/action`, actionData);
  return data;
};

// ===== Tags =====
export const getTags = async () => {
  const { data } = await api.get('/api/tags');
  return data;
};

// ===== User =====
export const getUser = async (telegramId) => {
  const { data } = await api.get(`/api/users/${telegramId}`);
  return data;
};

// ВОТ ЭТА ФУНКЦИЯ ОТСУТСТВОВАЛА!
export const getUserActions = async (telegramId) => {
  const { data } = await api.get(`/api/users/${telegramId}/actions`);
  return data;
};

export default api;
