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
  
  export default defineComponent({
    name: 'MatchHistoryView',
    props: {
      profile: {
        type: Object as PropType<Profile>,
        required: true
      },
      matchHistory: {
        type: Array as PropType<Match[]>,
        required: true
      }
    },
    methods: {
      logMapSrc(map: string) {
        console.log('Map:', map);
      }
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
.match-history {
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
}

.match-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1f1f1f;
  color: white;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid #444;
}

.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map-image {
  width: 100px;
  height: 60px;
  border-radius: 5px;
}

.match-details {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  padding-left: 20px;
}

.match-details p {
  margin: 0;
  padding: 0 10px;
}

.result {
  font-size: 18px;
  font-weight: bold;
  flex-basis: 80px;
  text-align: center;
}

.kda {
  flex-basis: 150px;
  text-align: center;
}

.rating {
  flex-basis: 100px;
  text-align: center;
}

.date {
  flex-basis: 150px;
  text-align: center;
}

.win {
  color: green;
}

.loss {
  color: red;
}

@media (max-width: 768px) {
  .match-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .match-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding-left:0;
  }

  .match-details p {
    text-align: center;
    padding: 2em;
  }
}
</style>