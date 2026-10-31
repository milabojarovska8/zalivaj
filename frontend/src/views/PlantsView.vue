<script setup>
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
</script>

<template>
  <h1>Moje rastline</h1>
  <p class="muted">Pozdravljeni, {{ auth.user?.name }}. Upravljanje rastlin bo na voljo kmalu.</p>
</template>
