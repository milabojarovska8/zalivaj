<script setup>
import { onMounted, ref } from 'vue';
import { errorMessage } from '../api/client.js';
import { plantsApi } from '../api/plants.js';
import PlantForm from '../components/PlantForm.vue';

const plants = ref([]);
const editing = ref(null);
const error = ref('');
const loading = ref(true);

async function load() {
  try {
    plants.value = await plantsApi.list();
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    loading.value = false;
  }
}

async function onSaved() {
  editing.value = null;
  await load();
}

async function remove(plant) {
  if (!confirm(`Izbrišem rastlino "${plant.name}"?`)) return;
  try {
    await plantsApi.remove(plant.id);
    if (editing.value?.id === plant.id) editing.value = null;
    await load();
  } catch (err) {
    alert(errorMessage(err));
  }
}

onMounted(load);
</script>

<template>
  <div class="layout-side">
    <section>
      <h1>Moje rastline</h1>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-else-if="loading" class="muted">Nalagam …</p>
      <p v-else-if="!plants.length" class="muted">Še nimate rastlin. Dodajte prvo z obrazcem.</p>
      <div class="grid">
        <article v-for="plant in plants" :key="plant.id" class="card plant-card">
          <img v-if="plant.photoUrl" :src="plant.photoUrl" :alt="plant.name" class="photo" />
          <div v-else class="photo placeholder">🪴</div>
          <strong>{{ plant.name }}</strong>
          <span class="muted">
            na {{ plant.wateringEveryDays }} {{ plant.wateringEveryDays === 1 ? 'dan' : 'dni' }}
            <template v-if="plant.waterAmountMl"> · {{ plant.waterAmountMl }} ml</template>
          </span>
          <div class="actions">
            <button class="btn light" @click="editing = plant">Uredi</button>
            <button class="btn danger" @click="remove(plant)">Izbriši</button>
          </div>
        </article>
      </div>
    </section>
    <aside>
      <PlantForm :plant="editing" @saved="onSaved" @cancel="editing = null" />
    </aside>
  </div>
</template>
