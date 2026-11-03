<script setup>
import { reactive, ref, watch } from 'vue';
import { errorMessage, fieldErrors } from '../api/client.js';
import { LIGHT_LABELS, plantsApi } from '../api/plants.js';

const props = defineProps({ plant: { type: Object, default: null } });
const emit = defineEmits(['saved', 'cancel']);

const empty = { name: '', species: '', wateringEveryDays: '', waterAmountMl: '', light: '', notes: '' };
const form = reactive({ ...empty });
const photo = ref(null);
const fileInput = ref(null);
const errors = ref({});
const error = ref('');
const saving = ref(false);

// Napolni obrazec z izbrano rastlino ali ga izprazni.
function fill(p) {
  Object.assign(form, empty, p ? Object.fromEntries(Object.keys(empty).map((k) => [k, p[k] ?? ''])) : {});
  photo.value = null;
  if (fileInput.value) fileInput.value.value = '';
  errors.value = {};
  error.value = '';
}

watch(() => props.plant, fill, { immediate: true });

async function submit() {
  errors.value = {};
  error.value = '';
  saving.value = true;
  try {
    const saved = props.plant
      ? await plantsApi.update(props.plant.id, form, photo.value)
      : await plantsApi.create(form, photo.value);
    if (!props.plant) fill(null);
    emit('saved', saved);
  } catch (err) {
    errors.value = fieldErrors(err);
    error.value = errorMessage(err);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form class="card" @submit.prevent="submit" novalidate>
    <h2>{{ plant ? 'Uredi rastlino' : 'Nova rastlina' }}</h2>
    <label>Ime *<input v-model="form.name" /></label>
    <p v-if="errors.name" class="error">{{ errors.name }}</p>
    <label>Vrsta<input v-model="form.species" /></label>
    <div class="row">
      <label>Zalivanje na (dni) *<input v-model="form.wateringEveryDays" type="number" min="1" step="1" /></label>
      <label>Količina vode (ml)<input v-model="form.waterAmountMl" type="number" min="1" step="1" /></label>
    </div>
    <p v-if="errors.wateringEveryDays" class="error">{{ errors.wateringEveryDays }}</p>
    <p v-if="errors.waterAmountMl" class="error">{{ errors.waterAmountMl }}</p>
    <label>
      Svetloba
      <select v-model="form.light">
        <option value="">–</option>
        <option v-for="(label, key) in LIGHT_LABELS" :key="key" :value="key">{{ label }}</option>
      </select>
    </label>
    <label>Opombe<textarea v-model="form.notes" rows="2"></textarea></label>
    <label>Fotografija<input ref="fileInput" type="file" accept="image/*" @change="photo = $event.target.files[0] || null" /></label>
    <p v-if="errors.photo" class="error">{{ errors.photo }}</p>
    <p v-if="error && !Object.keys(errors).length" class="error">{{ error }}</p>
    <div class="actions">
      <button class="btn" :disabled="saving">Shrani</button>
      <button v-if="plant" type="button" class="btn light" @click="emit('cancel')">Prekliči</button>
    </div>
  </form>
</template>
