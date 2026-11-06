import { api } from './client.js';

export const requestsApi = {
  create: (data) => api.post('/requests', data).then((r) => r.data),
  mine: () => api.get('/requests/mine').then((r) => r.data),
  get: (id) => api.get(`/requests/${id}`).then((r) => r.data),
  open: () => api.get('/requests/open').then((r) => r.data),
  apply: (id, message) => api.post(`/requests/${id}/applications`, { message }).then((r) => r.data),
  tasks: (id) => api.get(`/requests/${id}/tasks`).then((r) => r.data),
  applications: (id) => api.get(`/requests/${id}/applications`).then((r) => r.data),
  accept: (applicationId) => api.post(`/applications/${applicationId}/accept`).then((r) => r.data),
  withdraw: (applicationId) => api.patch(`/applications/${applicationId}/withdraw`).then((r) => r.data),
};
