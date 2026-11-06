import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import PlantsView from '../views/PlantsView.vue';
import MyRequestsView from '../views/MyRequestsView.vue';
import NewRequestView from '../views/NewRequestView.vue';
import RequestDetailView from '../views/RequestDetailView.vue';
import OpenRequestsView from '../views/OpenRequestsView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/plants' },
    { path: '/login', component: LoginView, meta: { guest: true } },
    { path: '/register', component: RegisterView, meta: { guest: true } },
    { path: '/plants', component: PlantsView, meta: { auth: true } },
    { path: '/requests', component: MyRequestsView, meta: { auth: true } },
    { path: '/requests/new', component: NewRequestView, meta: { auth: true } },
    { path: '/requests/:id', component: RequestDetailView, meta: { auth: true } },
    { path: '/open', component: OpenRequestsView, meta: { auth: true } },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.auth && !auth.isLoggedIn) return '/login';
  if (to.meta.guest && auth.isLoggedIn) return '/plants';
});

export default router;
