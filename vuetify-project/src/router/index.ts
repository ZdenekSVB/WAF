import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import HomeView from '../pages/HomeView.vue';

//VALORANT
import Valorant from '../pages/ValorantView.vue';
//CSGO
import Csgo from '../pages/CSView.vue';
//TFT
import TFTSearchView from '../pages/TFT/SearchView.vue';
import TFTStatsView from '../pages/TFT/StatsView.vue';
import TFTBuffNerfView from '../pages/TFT/BuffNerfView.vue';
import TFTRankingView from '../pages/TFT/RankingView.vue';
//LOL
import LOLSearchView from '../pages/LOL/LOLSearchView.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
//VALORANT
  {
    path: '/valorant',
    name: 'valorant',
    component: Valorant,
  },
//CSGO
  {
    path: '/counter-strike',
    name: 'counter-strike',
    component: Csgo,
  },
//TFT
  { path: '/tft/search', name: 'TFTSearch', component: TFTSearchView },
  { path: '/tft/stats', name: 'TFTStats', component: TFTStatsView },
  { path: '/tft/buffs-nerfs', name: 'TFTBuffNerf', component: TFTBuffNerfView },
  { path: '/tft/ranking', name: 'TFTRanking', component: TFTRankingView },
//LOL
  { path: '/lol/search', name: 'LOLSearch', component: LOLSearchView, },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
