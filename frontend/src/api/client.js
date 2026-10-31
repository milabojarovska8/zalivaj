import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

// Vsaki zahtevi doda žeton JWT iz localStorage.
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Ob poteku seje uporabnika odjavi in preusmeri na prijavo.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const onAuthPage = ['/login', '/register'].includes(window.location.pathname);
    if (err.response?.status === 401 && !onAuthPage) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

// Vrne sporočilo napake iz odgovora backenda.
export function errorMessage(err) {
  return err.response?.data?.error || 'Prišlo je do napake. Poskusite znova.';
}

export function fieldErrors(err) {
  return err.response?.data?.fields || {};
}
