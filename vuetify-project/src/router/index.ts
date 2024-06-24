import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import HomeView from '../pages/HomeView.vue';

//DOTA
import DOTA from '@/pages/DOTA/SearchView.vue';
import DOTAaccountView from '../pages/DOTA/AccountView.vue';
import DOTAmatchesView from '../pages/DOTA/MatchesView.vue';
import DOTArankingsView from '../pages/DOTA/RankingsView.vue';
import DOTAheroesView from '../pages/DOTA/HeroesView.vue';
import DOTAmatchDetailView from '../pages/DOTA/MatchDetail.vue';
import DOTAteamsView from '../pages/DOTA/TeamsView.vue';
import DOTAmyHeroes from '../pages/DOTA/MyHeroesPage.vue';
import DOTAteamMatchesHistory from '../pages/DOTA/TeamMatchHistory.vue';
import DOTAitemsView from '../pages/DOTA/Items.vue';

//CSGO
import Csgo from '../pages/CS/CSView.vue';
//TFT
import TFTSearchView from '../pages/TFT/SearchView.vue';
import TFTStatsView from '../pages/TFT/StatsView.vue';
import TFTBuffNerfView from '../pages/TFT/BuffNerfView.vue';
import TFTRankingView from '../pages/TFT/RankingView.vue';
//LOL
import LOLSearchView from '../pages/LOL/LOLSearchView.vue';
import LOLAccountView from '../pages/LOL/AccountView.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
//DOTA
  {
    path: '/dota',
    name: 'dota',
    component: DOTA,
  },
  {
    path: '/match/:matchId',
    name: 'MatchDetail',
    component: DOTAmatchDetailView,
    props: true
  },
  {
    path: '/heroes',
    name: 'HeroStats',
    component: DOTAheroesView
  },

  {
    path: '/my-heroes',
    name: 'MyHeroes',
    component: DOTAmyHeroes
  },

  {
    path: '/team/:teamId/matches',
    name: 'TeamMatches',
    component: DOTAteamMatchesHistory,
    props: true // Enables passing params as props
  },

  { path: '/account-view/:accountId', name: 'AccountView', component: DOTAaccountView, props: true },
  { path: '/account-view/:accountId/matches', name: 'MatchesView', component: DOTAmatchesView },
  { path: '/account-view/:accountId/rankings', name: 'RankingsView', component: DOTArankingsView },
  { path: '/account-view/:accountId/heroes', name: 'HeroesView', component: DOTAheroesView },

  { path: '/teams', name: 'Teams', component: DOTAteamsView },
  { path: '/items', name: 'Items', component: DOTAitemsView },




  //CSGO

  { path: '/account-view/:accountId', name: 'AccountView', component: DOTAaccountView, props: true },
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
  { path: '/lol/account', name: 'LOLAccount', component: LOLAccountView, props: { game: 'lol' } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
