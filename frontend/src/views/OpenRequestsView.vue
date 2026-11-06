<script setup>
import { onMounted, ref } from 'vue';
import { errorMessage } from '../api/client.js';
import { requestsApi } from '../api/requests.js';
import { formatRange } from '../utils.js';

const requests = ref([]);
const error = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    requests.value = await requestsApi.open();
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <h1>Odprte prošnje</h1>
  <p class="muted">Prošnje sosedov, ki iščejo varuha za svoje rastline.</p>
  <p v-if="error" class="error">{{ error }}</p>
  <p v-else-if="loading" class="muted">Nalagam …</p>
  <p v-else-if="!requests.length" class="muted">Trenutno ni odprtih prošenj.</p>
  <RouterLink v-for="r in requests" :key="r.id" :to="`/requests/${r.id}`" class="card list-item">
    <div>
      <strong>{{ formatRange(r.startDate, r.endDate) }}</strong>
      <div class="muted">
        {{ r.owner.name }} · {{ r.location }} · {{ r.plants.length }}
        {{ r.plants.length === 1 ? 'rastlina' : r.plants.length === 2 ? 'rastlini' : 'rastline' }}
      </div>
    </div>
    <span v-if="r.myApplication?.status === 'PENDING'" class="badge active">Prijavljen</span>
    <span v-else class="btn light">Podrobnosti</span>
  </RouterLink>
</template>
