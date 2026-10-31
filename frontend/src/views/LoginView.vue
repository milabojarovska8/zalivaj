<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { errorMessage } from '../api/client.js';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push('/plants');
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-box card">
    <h1>Prijava</h1>
    <form @submit.prevent="submit">
      <label>E-pošta<input v-model="email" type="email" required /></label>
      <label>Geslo<input v-model="password" type="password" required /></label>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn" :disabled="loading">Prijava</button>
    </form>
    <p class="muted center">Še nimate računa? <RouterLink to="/register">Registracija</RouterLink></p>
  </div>
</template>
