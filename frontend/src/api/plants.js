import { api } from './client.js';

export const LIGHT_LABELS = { LOW: 'Malo', MEDIUM: 'Srednje', HIGH: 'Veliko' };

// Rastline se pošiljajo kot FormData, ker lahko vsebujejo fotografijo.
function toFormData(plant, photo) {
  const fd = new FormData();
  for (const key of ['name', 'species', 'wateringEveryDays', 'waterAmountMl', 'light', 'notes']) {
    fd.append(key, plant[key] ?? '');
  }
  if (photo) fd.append('photo', photo);
  return fd;
}

export const plantsApi = {
  list: () => api.get('/plants').then((r) => r.data),
  create: (plant, photo) => api.post('/plants', toFormData(plant, photo)).then((r) => r.data),
  update: (id, plant, photo) => api.put(`/plants/${id}`, toFormData(plant, photo)).then((r) => r.data),
  remove: (id) => api.delete(`/plants/${id}`),
};
