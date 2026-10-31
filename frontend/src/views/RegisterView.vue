<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { errorMessage, fieldErrors } from '../api/client.js';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
const router = useRouter();
const form = reactive({ name: '', email: '', password: '', location: '' });
const errors = ref({});
const error = ref('');

async function submit() {
  errors.value = {};
  error.value = '';
  try {
    await auth.register(form);
    router.push('/plants');
  } catch (err) {
    errors.value = fieldErrors(err);
    error.value = errorMessage(err);
  }
}
</script>

<template>
  <div class="auth-box card">
    <h1>Registracija</h1>
    <form @submit.prevent="submit" novalidate>
      <label>Ime *<input v-model="form.name" /></label>
      <p v-if="errors.name" class="error">{{ errors.name }}</p>
      <label>E-pošta *<input v-model="form.email" type="email" /></label>
      <p v-if="errors.email" class="error">{{ errors.email }}</p>
      <label>Geslo *<input v-model="form.password" type="password" /></label>
      <p v-if="errors.password" class="error">{{ errors.password }}</p>
      <label>Lokacija (dom, blok) *<input v-model="form.location" placeholder="npr. Rožna dolina, blok 5" /></label>
      <p v-if="errors.location" class="error">{{ errors.location }}</p>
      <p v-if="error && !Object.keys(errors).length" class="error">{{ error }}</p>
      <button class="btn">Ustvari račun</button>
    </form>
    <p class="muted center">Že imate račun? <RouterLink to="/login">Prijava</RouterLink></p>
  </div>
</template>
