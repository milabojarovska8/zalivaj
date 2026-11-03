<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { errorMessage } from '../api/client.js';
import { requestsApi } from '../api/requests.js';
import { STATUS_LABELS, formatRange } from '../utils.js';

const route = useRoute();
const request = ref(null);
const error = ref('');

async function load() {
  try {
    request.value = await requestsApi.get(route.params.id);
  } catch (err) {
    error.value = errorMessage(err);
  }
}

onMounted(load);
</script>

<template>
  <p v-if="error" class="error">{{ error }}</p>
  <template v-else-if="request">
    <div class="header-row">
      <h1>Prošnja {{ formatRange(request.startDate, request.endDate) }}</h1>
      <span class="badge" :class="request.status.toLowerCase()">{{ STATUS_LABELS[request.status] }}</span>
    </div>
    <p class="muted">
      {{ request.location }}<template v-if="request.note"> · {{ request.note }}</template>
    </p>

    <h2>Rastline</h2>
    <div class="grid">
      <article v-for="plant in request.plants" :key="plant.id" class="card plant-card">
        <img v-if="plant.photoUrl" :src="plant.photoUrl" :alt="plant.name" class="photo" />
        <div v-else class="photo placeholder">🪴</div>
        <strong>{{ plant.name }}</strong>
        <span class="muted">
          na {{ plant.wateringEveryDays }} dni<template v-if="plant.waterAmountMl"> · {{ plant.waterAmountMl }} ml</template>
        </span>
        <span v-if="plant.notes" class="muted">»{{ plant.notes }}«</span>
      </article>
    </div>
  </template>
</template>
