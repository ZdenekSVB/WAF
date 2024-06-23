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
      <div v-if="view === 'stats'" class="statistics">
        <h3>Main statistics</h3>
        <div class="stat-grid">
          <div class="stat-card" v-if="profile.lifetime && profile.lifetime['Average K/D Ratio']">
            <h4>K/D Ratio</h4>
            <p>{{ profile.lifetime['Average K/D Ratio'] }}</p>
          </div>
          <div class="stat-card" v-if="profile.lifetime && profile.lifetime['Win Rate %']">
            <h4>Win Rate %</h4>
            <p>{{ profile.lifetime['Win Rate %'] }}%</p>
          </div>
          <div class="stat-card" v-if="profile.lifetime && profile.lifetime.Matches">
            <h4>Matches</h4>
            <p>Total Matches: {{ profile.lifetime.Matches }}</p>
            <p v-if="profile.lifetime.Wins">Total Wins: {{ profile.lifetime.Wins }}</p>
            <p v-if="profile.lifetime.Wins">Total Losses: {{ profile.lifetime.Matches - profile.lifetime.Wins }}</p>
          </div>
          <div class="stat-card" v-if="profile.lifetime && profile.lifetime['Total Headshots %']">
            <h4>Total Headshots</h4>
            <p>{{ profile.lifetime['Total Headshots %'] }}</p>
          </div>
          <div class="stat-card" v-if="profile.lifetime && profile.lifetime['Longest Win Streak']">
            <h4>Longest Win Streak</h4>
            <p>{{ profile.lifetime['Longest Win Streak'] }}</p>
          </div>
          <div class="stat-card" v-if="profile.lifetime && profile.lifetime['Current Win Streak']">
            <h4>Current Win Streak</h4>
            <p>{{ profile.lifetime['Current Win Streak'] }}</p>
          </div>
          <div class="stat-card" v-if="profile.lifetime && profile.lifetime['Recent Results']">
            <h4>Recent Results</h4>
            <p v-html="formatRecentResults(profile.lifetime['Recent Results'])"></p>
          </div>
        </div>
      </div>
      <div v-if="view === 'matchHistory'" class="match-history">
        <h3>Match history</h3>
        <div v-for="match in matchHistory" :key="match.match_id" class="match-card">
          <div class="map-container">
            <img :src="`/src/assets/maps/${match.map}.png`" alt="Map Image" class="map-image">
            <p>{{ match.map }}</p>
          </div>
          <div class="match-details">
            <p class="result" :class="{'win': match.results === 'Win', 'loss': match.results === 'Loss'}">{{ match.results }}</p>
            <p>K-A-D: {{ match.kills }}-{{ match.assists }}-{{ match.deaths }}</p>
            <p>Rating: {{ match.rating }}</p>
            <p>Date: {{ match.date }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getFaceitProfile, getFaceitStats, getFaceitMatchHistory } from '@/pages/CS/faceitService';

interface Profile {
  player_id: string;
  nickname: string;
  avatar: string;
  games?: {
    cs2?: {
      faceit_elo?: number;
    };
  };
  lifetime?: {
    Matches?: number;
    'Current Win Streak'?: number;
    'Longest Win Streak'?: number;
    'Total Headshots %'?: number;
    'Recent Results'?: string[];
    'Average K/D Ratio'?: number;
    'Win Rate %'?: number;
    Wins?: number;
  };
}

interface Match {
  match_id: string;
  results: string;
  kills: number;
  assists: number;
  deaths: number;
  rating: number;
  date: string;
  elo: number;
  map: string;
  img_small: string;
}

export default defineComponent({
  name: 'CSView',
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
      this.view = view;
      if (view === 'matchHistory' && this.profile) {
        this.showMatchHistory();
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
    },
    showStats() {
      this.view = 'stats';
    },
    showElo() {
      this.view = 'elo';
    },
    formatRecentResults(results: string[]) {
      return results
        .map(result => (result === '1' ? '<span style="color: green;">W</span>' : '<span style="color: red;">L</span>'))
        .join(' ');
    },
    logMapSrc(map: string) {
      console.log('Map:', map);
    }
  },
  mounted() {
    this.matchHistory.forEach(match => {
      this.logMapSrc(match.map);
    });
  },
  watch: {
    matchHistory(newMatchHistory) {
      newMatchHistory.forEach(match => {
        this.logMapSrc(match.map);
      });
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
