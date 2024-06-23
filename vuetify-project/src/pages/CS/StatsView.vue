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
          <p>{{ profile.lifetime.Matches }}</p>
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
  
  interface Profile {
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
  
  export default defineComponent({
    name: 'StatsView',
    props: {
      profile: {
        type: Object as PropType<Profile>,
        required: true
      }
    },
    methods: {
      formatRecentResults(results: number[]) {
        return results
          .map(result => (result === 1 ? '<span style="color: green;">W</span>' : '<span style="color: red;">L</span>'))
          .join(' ');
      }
    }
  });
  </script>
  
  <style scoped>
  .statistics {
    margin-top: 20px;
  }
  
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); 
    gap: 20px;
  }
  
  .stat-card {
    background: #1f1f1f;
    color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>
  