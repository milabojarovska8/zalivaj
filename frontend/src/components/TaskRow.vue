<script setup>
import { ref } from 'vue';
import { formatDate } from '../utils.js';

const props = defineProps({
  task: { type: Object, required: true },
  canComplete: { type: Boolean, default: false },
  busy: { type: Boolean, default: false },
});
const emit = defineEmits(['done']);
const note = ref('');
</script>

<template>
  <div class="card task-row" :class="{ overdue: task.overdue }">
    <img v-if="task.plant.photoUrl" :src="task.plant.photoUrl" :alt="task.plant.name" class="thumb" />
    <div v-else class="thumb placeholder">🪴</div>
    <div class="task-info">
      <strong>{{ task.plant.name }}</strong>
      <span v-if="task.overdue" class="badge overdue">Zamujeno</span>
      <div class="muted">
        {{ formatDate(task.dueDate) }}
        <template v-if="task.plant.waterAmountMl"> · {{ task.plant.waterAmountMl }} ml</template>
        <template v-if="task.request"> · {{ task.request.ownerName }}</template>
      </div>
      <div v-if="task.plant.notes" class="muted">»{{ task.plant.notes }}«</div>
      <div v-if="task.status === 'DONE' && task.note" class="muted">Opomba: {{ task.note }}</div>
    </div>
    <template v-if="task.status === 'PENDING'">
      <input v-if="canComplete" v-model="note" class="note" placeholder="Opomba (neobvezno)" />
      <button
        class="btn"
        :disabled="!canComplete || busy"
        :title="canComplete ? '' : 'Opravila ni mogoče označiti pred njegovim datumom'"
        @click="emit('done', note)"
      >
        Opravljeno
      </button>
    </template>
    <span v-else class="badge active">Opravljeno</span>
  </div>
</template>
