import { api } from './client.js';

export const requestsApi = {
  create: (data) => api.post('/requests', data).then((r) => r.data),
  mine: () => api.get('/requests/mine').then((r) => r.data),
  get: (id) => api.get(`/requests/${id}`).then((r) => r.data),
};
