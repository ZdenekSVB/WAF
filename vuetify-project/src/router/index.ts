import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../pages/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  
  {
    path: '/valorant',
    name: 'valorant',
    component: () => import('../pages/ValorantView.vue'),
  },
  {
    path: '/counter-strike',
    name: 'counter-strike',
    component: () => import('../pages/CSView.vue'),
  },
  {
    path: '/tft',
    name: 'tft',
    component: () => import('../pages/TFTView.vue'),
  },
  {
    path: '/league-of-legends',
    name: 'league-of-legends',
    component: () => import('../pages/LOLView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
