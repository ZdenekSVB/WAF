<template>
    <div class="match-history">
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
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
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
    name: 'MatchHistoryView',
    props: {
      matchHistory: {
        type: Array as PropType<Match[]>,
        required: true
      }
    }
  });
  </script>
  
  <style scoped>
  .match-history {
    margin-top: 20px;
  }
  
  .match-card {
    display: flex;
    gap: 20px;
    border: 1px solid #444;
    margin-bottom: 10px;
    background: #1f1f1f;
    color: white;
    padding: 20px;
    border-radius: 10px;
    align-items: center;
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
  