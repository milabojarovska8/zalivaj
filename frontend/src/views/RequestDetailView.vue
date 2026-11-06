<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { errorMessage } from '../api/client.js';
import { requestsApi } from '../api/requests.js';
import { STATUS_LABELS, formatRange, trustLabel } from '../utils.js';

const route = useRoute();
const request = ref(null);
const applications = ref([]);
const error = ref('');
const message = ref('');
const actionError = ref('');
const busy = ref(false);

async function load() {
  try {
    request.value = await requestsApi.get(route.params.id);
    applications.value = request.value.isOwner ? await requestsApi.applications(route.params.id) : [];
  } catch (err) {
    error.value = errorMessage(err);
  }
}

// Izvede dejanje, nato ponovno naloži prošnjo.
async function act(fn) {
  actionError.value = '';
  busy.value = true;
  try {
    await fn();
    await load();
  } catch (err) {
    actionError.value = errorMessage(err);
  } finally {
    busy.value = false;
  }
}

const apply = () => act(() => requestsApi.apply(request.value.id, message.value));
const accept = (application) => {
  if (!confirm(`Sprejmem varuha ${application.sitter.name}? Ostale prijave bodo zavrnjene.`)) return;
  act(() => requestsApi.accept(application.id));
};
const withdraw = () => act(() => requestsApi.withdraw(request.value.myApplication.id));

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

    <!-- Lastnik: prijave in izbira varuha -->
    <section v-if="request.isOwner">
      <p v-if="request.sitter" class="card"><strong>Varuh:</strong> {{ request.sitter.name }}</p>
      <template v-if="request.status === 'OPEN'">
        <h2>Prijave ({{ applications.length }})</h2>
        <p v-if="!applications.length" class="muted">Na prošnjo se še nihče ni prijavil.</p>
        <div v-for="a in applications" :key="a.id" class="card list-item">
          <div>
            <strong>{{ a.sitter.name }}</strong> <span class="muted">· {{ trustLabel(a.trust) }}</span>
            <div v-if="a.message" class="muted">»{{ a.message }}«</div>
          </div>
          <button class="btn" :disabled="busy" @click="accept(a)">Sprejmi</button>
        </div>
      </template>
      <p v-if="actionError" class="error">{{ actionError }}</p>
    </section>

    <!-- Sprejeti varuh -->
    <p v-if="!request.isOwner && request.myApplication?.status === 'ACCEPTED'" class="card">
      <span class="badge active">Sprejeti</span> Za to varstvo ste izbrani kot varuh.
    </p>

    <!-- Varuh: prijava na odprto prošnjo -->
    <section v-if="!request.isOwner && request.status === 'OPEN'" class="card apply-box">
      <template v-if="request.myApplication?.status === 'PENDING'">
        <p><span class="badge active">Prijavljen</span> Lastnik bo izbral varuha med prijavljenimi.</p>
        <button class="btn light" :disabled="busy" @click="withdraw">Umakni prijavo</button>
      </template>
      <template v-else-if="request.myApplication?.status === 'REJECTED'">
        <p class="muted">Lastnik je izbral drugega varuha.</p>
      </template>
      <template v-else>
        <h2>Prijava</h2>
        <label>Sporočilo lastniku<textarea v-model="message" rows="2" placeholder="npr. Ves november sem doma."></textarea></label>
        <button class="btn" :disabled="busy" @click="apply">Prijavi se</button>
      </template>
      <p v-if="actionError" class="error">{{ actionError }}</p>
    </section>
  </template>
</template>
