<template>
    <div class="statistics">
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
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    name: 'StatsView',
    props: {
      profile: {
        type: Object as PropType<Profile>,
        required: true
      }
    },
    methods: {
      formatRecentResults(results: string[]) {
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
