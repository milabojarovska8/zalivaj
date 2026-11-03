<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { errorMessage, fieldErrors } from '../api/client.js';
import { plantsApi } from '../api/plants.js';
import { requestsApi } from '../api/requests.js';
import { useAuthStore } from '../stores/auth.js';
import { todayStr } from '../utils.js';

const auth = useAuthStore();
const router = useRouter();
const plants = ref([]);
const form = reactive({ startDate: '', endDate: '', location: auth.user?.location || '', note: '', plantIds: [] });
const errors = ref({});
const error = ref('');
const saving = ref(false);

onMounted(async () => {
  plants.value = await plantsApi.list();
});

async function submit() {
  errors.value = {};
  error.value = '';
  saving.value = true;
  try {
    const created = await requestsApi.create(form);
    router.push(`/requests/${created.id}`);
  } catch (err) {
    errors.value = fieldErrors(err);
    error.value = errorMessage(err);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form class="card narrow" @submit.prevent="submit" novalidate>
    <h1>Nova prošnja za varstvo</h1>
    <div class="row">
      <label>Od *<input v-model="form.startDate" type="date" :min="todayStr()" /></label>
      <label>Do *<input v-model="form.endDate" type="date" :min="form.startDate || todayStr()" /></label>
    </div>
    <p v-if="errors.startDate" class="error">{{ errors.startDate }}</p>
    <p v-if="errors.endDate" class="error">{{ errors.endDate }}</p>
    <label>Lokacija *<input v-model="form.location" /></label>
    <p v-if="errors.location" class="error">{{ errors.location }}</p>
    <label>Opomba<input v-model="form.note" placeholder="npr. Ključ je na recepciji" /></label>

    <fieldset>
      <legend>Rastline *</legend>
      <p v-if="!plants.length" class="muted">
        Najprej <RouterLink to="/plants">dodajte rastline</RouterLink>.
      </p>
      <label v-for="plant in plants" :key="plant.id" class="check">
        <input v-model="form.plantIds" type="checkbox" :value="plant.id" />
        {{ plant.name }} <span class="muted">(na {{ plant.wateringEveryDays }} dni)</span>
      </label>
    </fieldset>
    <p v-if="errors.plantIds" class="error">{{ errors.plantIds }}</p>
    <p v-if="error && !Object.keys(errors).length" class="error">{{ error }}</p>

    <div class="actions">
      <button class="btn" :disabled="saving">Objavi prošnjo</button>
      <RouterLink to="/requests" class="btn light">Prekliči</RouterLink>
    </div>
  </form>
</template>
