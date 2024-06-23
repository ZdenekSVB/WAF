<template>
  <v-app>
    <NavBar />
    <v-main>
      <v-container>
        <v-card class="match-card" elevation="2">
          <v-card-title>Match Details - {{ match.match_id }}</v-card-title>
          <v-card-text v-if="match">
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Duration</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDuration(match.duration) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Game Mode</v-list-item-title>
                  <v-list-item-subtitle>{{ match.game_mode }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Radiant Win</v-list-item-title>
                  <v-list-item-subtitle>{{ match.radiant_win }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <!-- Add more match details as needed -->
            </v-list>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import NavBar from '@/pages/DOTA/NavBar.vue';

export default defineComponent({
  name: 'MatchDetail',
  components: {
    NavBar
  },
  data() {
    return {
      match: null,
    };
  },
  async beforeRouteEnter(to, from, next) {
    try {
      const matchId = to.params.matchId;
      const response = await axios.get(`https://api.opendota.com/api/matches/${matchId}`);
      next(vm => {
        vm.match = response.data;
      });
    } catch (error) {
      console.error('Error fetching match data:', error);
      next(false); // cancel navigation on error
    }
  },
  methods: {
    formatDuration(duration) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}m ${seconds}s`;
    }
  }
});
</script>

<style scoped>
.match-card {
  animation: fadeIn 1s ease-in-out;
  margin-top: 20px;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
