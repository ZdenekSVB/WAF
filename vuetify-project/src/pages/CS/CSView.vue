<template>
  <v-app class="app-background">
    <div class="background-overlay"></div>
    <v-navigation-drawer v-model="isMenuOpen" app>
      <v-list>
        <v-list-item @click="navigateTo(0)" data-cy="nav-main-page">
          <v-list-item-title>Main Page</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo(1)" data-cy="nav-tft">
          <v-list-item-title>TFT</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo(2)" data-cy="nav-cs2">
          <v-list-item-title>CS2</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo(3)" data-cy="nav-lol">
          <v-list-item-title>LOL</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo(4)" data-cy="nav-dota">
          <v-list-item-title>Dota</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>
        <v-icon @click="toggleMenu" data-cy="toggle-menu">mdi-menu</v-icon>
        <img src="@/assets/FACEITLogo.png" alt="FACEIT Logo" class="logo" data-cy="logo">
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tabs v-if="profile" v-model="view" centered>
        <v-tab :key="'stats'" @click="setView('stats')" data-cy="tab-stats">Stats</v-tab>
        <v-tab :key="'matchHistory'" @click="setView('matchHistory')" data-cy="tab-match-history">Match history</v-tab>
        <v-tab :key="'elo'" @click="setView('elo')" data-cy="tab-elo">ELO</v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <v-container>
        <!-- Přidání načítací animace -->
        <v-row class="justify-center" v-if="isLoading">
          <v-col cols="12" md="8" class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary" data-cy="loading-spinner"></v-progress-circular>
          </v-col>
        </v-row>

        <!-- Obsah se zobrazí, pouze pokud není načítání -->
        <v-row v-if="!isLoading" class="search-section" justify="center">
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title>
                <v-text-field v-model="nickname" label="Search player's profile" outlined data-cy="input-search"></v-text-field>
                <v-btn @click="searchProfile" color="primary" data-cy="btn-search">Search</v-btn>
              </v-card-title>
              <v-alert v-if="errorMessage" type="error" data-cy="error-message">{{ errorMessage }}</v-alert>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="profile && !isLoading" class="profile-section" justify="center">
          <v-col cols="12" md="8">
            <v-card data-cy="profile-card">
              <v-card-title>
                <v-img :src="profile.avatar" alt="Player Avatar" contain class="avatar-img" data-cy="player-avatar"></v-img>
                <div>
                  <h2 data-cy="player-nickname">{{ profile.nickname }}</h2>
                  <p v-if="profile.games && profile.games.cs2">ELO: <span data-cy="player-elo">{{ profile.games.cs2.faceit_elo }}</span></p>
                </div>
              </v-card-title>
              <StatsView v-if="view === 'stats'" :profile="profile" data-cy="stats-view"/>
              <MatchHistoryView v-if="view === 'matchHistory'" :profile="profile" :matchHistory="matchHistory" data-cy="match-history-view"/>
              <EloView v-if="view === 'elo'" :profile="profile" data-cy="elo-view"/>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getFaceitProfile, getFaceitStats, getFaceitMatchHistory } from '@/pages/CS/faceitService';
import StatsView from '@/pages/CS/StatsView.vue';
import MatchHistoryView from '@/pages/CS/MatchHistoryView.vue';
import EloView from '@/pages/CS/EloView.vue';

export default defineComponent({
  name: 'CSView',
  components: { StatsView, MatchHistoryView, EloView },
  data() {
    return {
      nickname: '',
      profile: null as Profile | null,
      matchHistory: [] as Match[],
      view: 'stats',
      isMenuOpen: false,
      errorMessage: '',
      isLoading: false 
    };
  },
  methods: {
    setView(view: string) {
      this.view = view;
      if (view === 'matchHistory' && this.profile) {
        this.showMatchHistory();
      }
    },
    async searchProfile() {
      try {
        this.errorMessage = '';
        this.isLoading = true; 
        const profile = await getFaceitProfile(this.nickname);
        if (profile) {
          const stats = await getFaceitStats(profile.player_id);
          this.profile = { ...profile, ...stats };
        }
      } catch (error) {
        this.errorMessage = 'Player not found. Please check the nickname and try again.';
      } finally {
        this.isLoading = false; 
      }
    },
    async showMatchHistory() {
      if (this.profile) {
        try {
          this.isLoading = true;
          const matchHistory = await getFaceitMatchHistory(this.profile.player_id);
          this.matchHistory = matchHistory;
        } finally {
          this.isLoading = false;
        }
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    navigateTo(index: number) {
      const routes = ['/', '/tft/search', '/counter-strike', '/lol/search', '/dota'];
      this.$router.push(routes[index]);
    }
  }
});
</script>

<style scoped>
.app-background {
  position: relative;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/counter-strike.png') no-repeat center center fixed;
  background-size: cover;
  filter: blur(10px);
  z-index: -1;
}

.logo {
  height: 50px;
  margin-left: 10px;
}

.search-section {
  margin-top: 20px;
}

.profile-section {
  margin-top: 20px;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
}

@media (max-width: 600px) {
  .logo {
    height: 30px;
    width: auto;
  }
}
</style>
