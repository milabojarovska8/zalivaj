<script setup>
import { onMounted, ref } from 'vue';
import { errorMessage } from '../api/client.js';
import { requestsApi } from '../api/requests.js';
import { STATUS_LABELS, formatRange } from '../utils.js';

const requests = ref([]);
const error = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    requests.value = await requestsApi.mine();
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="header-row">
    <h1>Moje prošnje</h1>
    <RouterLink to="/requests/new" class="btn">+ Nova prošnja</RouterLink>
  </div>
  <p v-if="error" class="error">{{ error }}</p>
  <p v-else-if="loading" class="muted">Nalagam …</p>
  <p v-else-if="!requests.length" class="muted">Še nimate prošenj za varstvo.</p>
  <RouterLink v-for="r in requests" :key="r.id" :to="`/requests/${r.id}`" class="card list-item">
    <div>
      <strong>{{ formatRange(r.startDate, r.endDate) }}</strong>
      <div class="muted">{{ r.location }} · {{ r.plants.map((p) => p.name).join(', ') }}</div>
    </div>
    <span class="badge" :class="r.status.toLowerCase()">{{ STATUS_LABELS[r.status] }}</span>
  </RouterLink>
</template>
