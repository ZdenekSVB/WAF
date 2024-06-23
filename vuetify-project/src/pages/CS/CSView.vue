<template>
  <div class="cs-view">
    <header>
      <img src="@/assets/FACEITLogo.png" alt="FACEIT Logo" class="logo">
      <nav v-if="profile">
        <a @click.prevent="setView('stats')" :class="{ disabled: view === 'stats' }">Stats</a>
        <a @click.prevent="setView('matchHistory')" :class="{ disabled: view === 'matchHistory' }">Match history</a>
        <a @click.prevent="setView('elo')" :class="{ disabled: view === 'elo' }">ELO</a>
      </nav>
    </header>
    <div class="search-section">
      <div class="search-container">
        <input v-model="nickname" placeholder="Search player's profile" />
        <button @click="searchProfile">Search</button>
      </div>
    </div>
    <div v-if="profile" class="profile-section">
      <div class="profile-header">
        <img :src="profile.avatar" alt="Player Avatar" class="avatar">
        <div>
          <h2>{{ profile.nickname }}</h2>
          <p v-if="profile.games && profile.games.cs2">ELO: <span>{{ profile.games.cs2.faceit_elo }}</span></p>
        </div>
      </div>
      <StatsView v-if="view === 'stats'" :profile="profile" />
      <MatchHistoryView v-if="view === 'matchHistory'" :profile="profile" :matchHistory="matchHistory" />
      <EloView v-if="view === 'elo'" :profile="profile" />
    </div>
  </div>
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
      view: 'stats'
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
      }
    },
    async showMatchHistory() {
      if (this.profile) {
        try {
          const matchHistory = await getFaceitMatchHistory(this.profile.player_id);
          this.matchHistory = matchHistory;
          console.log('Match history:', this.matchHistory);
        } catch (error) {
          console.error('Error fetching match history:', error);
        }
      }
    }
  }
});
</script>


<style scoped>
.cs-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('@/assets/counter-strike.png') no-repeat center center;
  background-size: cover;
  height: 100vh;
  overflow-y: auto;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
}

.logo {
  height: 50px;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: white;
  text-decoration: none;
  font-size: 18px;
  cursor: pointer;
}

nav a.disabled {
  pointer-events: none;
  color: gray;
}

.search-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin-top: 20px;
}

.search-container {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
}

input {
  padding: 10px;
  border: none;
  border-radius: 5px 0 0 5px;
  outline: none;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 0 5px 5px 0;
  background: orange;
  color: white;
  font-size: 16px;
  cursor: pointer;
  outline: none;
}

button:hover {
  background: darkorange;
}

.profile-section {
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  width: 90%;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.statistics, .match-history {
  margin-top: 20px;
}

.stat-grid, .match-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card, .match-card {
  background: #1f1f1f;
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.match-card {
  gap: 20px;
  border: 1px solid #444;
  margin-bottom: 10px;
}

.match-card .map-image {
  width: 100px;
  height: 60px;
  border-radius: 5px;
}

.match-details {
  display: flex;
  flex-direction: column;
}

.result {
  font-size: 18px;
  font-weight: bold;
}

.win {
  color: green;
}

.loss {
  color: red;
}
</style>
