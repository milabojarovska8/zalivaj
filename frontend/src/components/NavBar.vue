<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push('/login');
}
</script>

<template>
  <header v-if="auth.isLoggedIn" class="nav">
    <RouterLink to="/plants" class="logo">Zalivaj</RouterLink>
    <nav>
      <RouterLink to="/plants">Moje rastline</RouterLink>
    </nav>
    <div class="nav-right">
      <span class="muted">{{ auth.user?.name }}</span>
      <button class="btn light" @click="logout">Odjava</button>
    </div>
  </header>
</template>
