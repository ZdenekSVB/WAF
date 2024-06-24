<template>
  <v-app>
    <AppBar :currentCategory="'DOTA'"/>
    <v-main>
      <v-container>
        <v-card class="matches-card" elevation="2">
          <v-card-title>Team Matches History</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="matches"
              class="elevation-1"
            >
              <template v-slot:item.opposing_team_logo="{ item }">
                <v-img
                  v-if="item.opposing_team_logo"
                  :src="item.opposing_team_logo"
                  alt="Opposing Team Logo"
                  height="50"
                  width="50"
                ></v-img>
                <span v-else>No Logo</span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppBar from '@/components/AppBar.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

interface Match {
  match_id: number;
  radiant: boolean;
  radiant_win: boolean;
  radiant_score: number;
  dire_score: number;
  duration: number;
  start_time: number;
  leagueid: number;
  league_name: string;
  cluster: number;
  opposing_team_id: number;
  opposing_team_name: string;
  opposing_team_logo: string;
}

export default defineComponent({
  name: 'TeamMatches',
  components: {
    AppBar
  },
  data() {
    return {
      matches: [] as Match[],
      headers: [
        { title: 'Match ID', value: 'match_id' },
        { title: 'Radiant', value: 'radiant' },
        { title: 'Radiant Win', value: 'radiant_win' },
        { title: 'Radiant Score', value: 'radiant_score' },
        { title: 'Dire Score', value: 'dire_score' },
        { title: 'Duration', value: 'duration' },
        { title: 'Start Time', value: 'start_time' },
        { title: 'League ID', value: 'leagueid' },
        { title: 'League Name', value: 'league_name' },
        { title: 'Opposing Team', value: 'opposing_team_name' },
        { title: 'Opposing Team Logo', value: 'opposing_team_logo' }
      ]
    };
  },
  async created() {
    const route = useRoute();
    const teamId = Number(route.params.teamId);
    const matchesJson = route.query.matches as string;

    if (matchesJson) {
      try {
        this.matches = JSON.parse(matchesJson);
      } catch (error) {
        console.error('Error parsing matches JSON:', error);
      }
    } else {
      try {
        const response = await axios.get(`https://api.opendota.com/api/teams/${teamId}/matches`);
        this.matches = response.data;
      } catch (error) {
        console.error('Error fetching team matches:', error);
      }
    }
  }
});
</script>

<style scoped>
/* Add scoped styles if necessary */
.matches-card {
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
.v-data-table__row {
  transition: background-color 0.3s ease;
}
.v-data-table__row:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
