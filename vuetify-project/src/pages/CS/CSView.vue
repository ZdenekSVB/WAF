<template>
  <div class="cs-view">
    <header>
      <img src="@/assets/FACEITLogo.png" alt="FACEIT Logo" class="logo">
      <nav>
        <a @click.prevent="setView('stats')">Stats</a>
        <a @click.prevent="setView('matchHistory')">Match history</a>
        <a @click.prevent="setView('elo')">ELO</a>
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
          <div class="stat-card">
            <h4>K/D Ratio</h4>
            <p>{{ profile.lifetime['Average K/D Ratio'] }}</p>
          </div>
          <div class="stat-card">
            <h4>Win Rate %</h4>
            <p>{{ profile.lifetime['Win Rate %'] }}%</p>
          </div>
          <div class="stat-card">
            <h4>Matches</h4>
            <p>{{ profile.lifetime.Matches }}</p>
            <p>Total Wins: {{ profile.lifetime.Wins }}</p>
            <p>Total Losses: {{ profile.lifetime.Matches - profile.lifetime.Wins }}</p>
          </div>
          <div class="stat-card">
            <h4>Total Headshots</h4>
            <p>{{ profile.lifetime['Total Headshots %'] }}</p>
          </div>
          <div class="stat-card">
            <h4>Longest Win Streak</h4>
            <p>{{ profile.lifetime['Longest Win Streak'] }}</p>
          </div>
          <div class="stat-card">
            <h4>Current Win Streak</h4>
            <p>{{ profile.lifetime['Current Win Streak'] }}</p>
          </div>
          <div class="stat-card">
            <h4>Recent Results</h4>
            <p v-html="formatRecentResults(profile.lifetime['Recent Results'])"></p>
          </div>
        </div>
      </div>
      <div v-if="view === 'matchHistory'" class="match-history">
        <h3>Match history</h3>
        <div v-for="match in matchHistory" :key="match.match_id" class="match-card">
          <img :src="getMapImage(match.label)" alt="Map Image" class="map-image">
          <div class="match-details">
            <p :class="{'win': match.results === 'Win', 'loss': match.results === 'Loss'}">{{ match.results }}</p>
            <p>K-A-D: {{ match.kills }}-{{ match.assists }}-{{ match.deaths }}</p>
            <p>Rating: {{ match.rating }}</p>
            <p>Date: {{ match.date }}</p>
            <p>Elo Point: {{ match.elo }}</p>
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
    'Recent Results'?: number[];
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
  label: string;
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
    async searchProfile() {
      console.log('Search button clicked');
      try {
        console.log(`Fetching profile for nickname: ${this.nickname}`);
        this.profile = await getFaceitProfile(this.nickname);
        console.log('Profile fetched:', this.profile);
        if (this.profile) {
          console.log(`Fetching stats for player ID: ${this.profile.player_id}`);
          const stats = await getFaceitStats(this.profile.player_id);
          console.log('Stats fetched:', stats);
          this.profile = { ...this.profile, ...stats };
          if (this.view === 'matchHistory') {
            console.log(`Fetching match history for player ID: ${this.profile.player_id}`);
            const matchHistory = await getFaceitMatchHistory(this.profile.player_id);
            console.log('Match history fetched:', matchHistory);
            this.matchHistory = matchHistory;
          }
        }
      } catch (error) {
        console.error('Error fetching profile or stats:', error);
      }
    },
    async showMatchHistory() {
      this.view = 'matchHistory';
      if (this.profile) {
        try {
          console.log(`Fetching match history for player ID: ${this.profile.player_id}`);
          const matchHistory = await getFaceitMatchHistory(this.profile.player_id);
          console.log('Match history fetched:', matchHistory);
          this.matchHistory = matchHistory;
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
    getMapImage(label: string) {
      const mapImages: { [key: string]: string } = {
        Anubis: 'Anubis.png',
        Nuke: 'Nuke.png',
        Overpass: 'Overpass.png',
        Mirage: 'Mirage.png',
        Ancient: 'Ancient.png',
      };
      return require(`@/assets/maps/${mapImages[label]}`);
    },
    formatRecentResults(results: number[]) {
      return results
        .map(result => (result === '1' ? '<span style="color: green;">W</span>' : '<span style="color: red;">L</span>'))
        .join(' ');
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
  text-align: left;
}

.stat-card h4, .match-card h4 {
  margin-bottom: 10px;
}

.stat-card p, .match-card p {
  font-size: 16px;
  margin: 5px 0;
}

.map-image {
  width: 100px;
  height: auto;
}

.match-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.win {
  color: green;
}

.loss {
  color: red;
}
</style>
