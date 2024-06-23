<template>
  <v-app class="app-background">
    <v-navigation-drawer v-model="isMenuOpen" app>
      <v-list>
        <v-list-item @click="navigateTo(0)">
          <v-list-item-title>Main Page</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo(1)">
          <v-list-item-title>TFT</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo(2)">
          <v-list-item-title>CS2</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo(3)">
          <v-list-item-title>LOL</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo(4)">
          <v-list-item-title>Valorant</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>
        <v-icon @click="toggleMenu">mdi-menu</v-icon>
        <img src="@/assets/FACEITLogo.png" alt="FACEIT Logo" class="logo">
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tabs v-if="profile" v-model="view" centered>
        <v-tab :key="'stats'" @click="setView('stats')">Stats</v-tab>
        <v-tab :key="'matchHistory'" @click="setView('matchHistory')">Match history</v-tab>
        <v-tab :key="'elo'" @click="setView('elo')">ELO</v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <v-container>
        <!-- Přidání načítací animace -->
        <v-row class="justify-center" v-if="isLoading">
          <v-col cols="12" md="8" class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-col>
        </v-row>
        
        <!-- Obsah se zobrazí, pouze pokud není načítání -->
        <v-row v-if="!isLoading" class="search-section" justify="center">
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title>
                <v-text-field v-model="nickname" label="Search player's profile" outlined></v-text-field>
                <v-btn @click="searchProfile" color="primary">Search</v-btn>
              </v-card-title>
              <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="profile && !isLoading" class="profile-section" justify="center">
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title>
                <v-img :src="profile.avatar" alt="Player Avatar" contain class="avatar-img"></v-img>
                <div>
                  <h2>{{ profile.nickname }}</h2>
                  <p v-if="profile.games && profile.games.cs2">ELO: <span>{{ profile.games.cs2.faceit_elo }}</span></p>
                </div>
              </v-card-title>
              <StatsView v-if="view === 'stats'" :profile="profile" />
              <MatchHistoryView v-if="view === 'matchHistory'" :profile="profile" :matchHistory="matchHistory" />
              <EloView v-if="view === 'elo'" :profile="profile" />
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
      isLoading: false // Přidaný stav načítání
    };
  },
  methods: {
    setView(view: string) {
      console.log('Setting view to:', view);
      this.view = view;
      if (view === 'matchHistory' && this.profile) {
        this.showMatchHistory();
      }
      if (view === 'elo' && this.profile) {
        console.log('Switching to ELO view');
      }
    },
    async searchProfile() {
      try {
        this.errorMessage = '';
        this.isLoading = true; // Nastavení načítání na true
        this.profile = await getFaceitProfile(this.nickname);
        console.log('Profile:', this.profile);
        if (this.profile) {
          const stats = await getFaceitStats(this.profile.player_id);
          this.profile = { ...this.profile, ...stats };
          console.log('Updated Profile with Stats:', this.profile);
          this.view = 'stats';
        }
      } catch (error) {
        console.error('Error fetching profile or stats:', error);
        this.errorMessage = 'Player not found. Please check the nickname and try again.';
      } finally {
        this.isLoading = false; // Nastavení načítání na false
      }
    },
    async showMatchHistory() {
      if (this.profile) {
        try {
          this.isLoading = true; 
          const matchHistory = await getFaceitMatchHistory(this.profile.player_id);
          this.matchHistory = matchHistory;
          console.log('Match history:', this.matchHistory);
        } catch (error) {
          console.error('Error fetching match history:', error);
        } finally {
          this.isLoading = false; 
        }
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    navigateTo(index: number) {
      const routes = ['/', '/tft/search', '/counter-strike', '/league-of-legends', '/valorant'];
      this.$router.push(routes[index]);
    }
  }
});
</script>


<style scoped>
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
