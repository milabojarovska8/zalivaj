import { defineStore } from 'pinia';
import { api } from '../api/client.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setSession({ token, user }) {
      this.token = token;
      this.user = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password });
      this.setSession(data);
    },
    async register(form) {
      const { data } = await api.post('/auth/register', form);
      this.setSession(data);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});
