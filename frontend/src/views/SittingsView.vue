<script setup>
import { onMounted, ref } from 'vue';
import { errorMessage } from '../api/client.js';
import { tasksApi } from '../api/requests.js';
import TaskRow from '../components/TaskRow.vue';
import { formatDate } from '../utils.js';

const data = ref(null);
const error = ref('');
const busyId = ref(null);

async function load() {
  try {
    data.value = await tasksApi.my();
  } catch (err) {
    error.value = errorMessage(err);
  }
}

async function markDone(task, note) {
  error.value = '';
  busyId.value = task.id;
  try {
    await tasksApi.done(task.id, note);
    await load();
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    busyId.value = null;
  }
}

onMounted(load);
</script>

<template>
  <div class="header-row">
    <h1>Moja varstva</h1>
    <span v-if="data" class="muted">Danes je {{ formatDate(data.date) }}</span>
  </div>
  <p v-if="error" class="error">{{ error }}</p>
  <template v-if="data">
    <p v-if="!data.overdue.length && !data.today.length && !data.upcoming.length && !data.done.length" class="muted">
      Trenutno nimate aktivnih varstev. Poiščite jih med <RouterLink to="/open">odprtimi prošnjami</RouterLink>.
    </p>

    <template v-if="data.overdue.length">
      <h2 class="danger-text">Zamujeno ({{ data.overdue.length }})</h2>
      <TaskRow v-for="t in data.overdue" :key="t.id" :task="t" can-complete :busy="busyId === t.id" @done="markDone(t, $event)" />
    </template>

    <h2>Danes ({{ data.today.length }})</h2>
    <p v-if="!data.today.length" class="muted">Danes ni zalivanja.</p>
    <TaskRow v-for="t in data.today" :key="t.id" :task="t" can-complete :busy="busyId === t.id" @done="markDone(t, $event)" />

    <h2>Prihajajoče ({{ data.upcoming.length }})</h2>
    <p v-if="!data.upcoming.length" class="muted">Ni prihajajočih zalivanj.</p>
    <TaskRow v-for="t in data.upcoming" :key="t.id" :task="t" />

    <template v-if="data.done.length">
      <h2>Opravljeno ({{ data.done.length }})</h2>
      <TaskRow v-for="t in data.done" :key="t.id" :task="t" />
    </template>
  </template>
</template>
