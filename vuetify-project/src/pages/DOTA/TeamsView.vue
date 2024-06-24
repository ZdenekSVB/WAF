<template>
  <v-app>
    <AppBar :currentCategory="'DOTA'"/>
    <v-main>
      <v-container>
        <v-card class="teams-card" elevation="2">
          <v-card-title>Team Statistics</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="Search by Name"
              outlined
              dense
              clearable
            ></v-text-field>
            <v-data-table
              :headers="headers"
              :items="filteredTeams"
              item-key="team_id"
              class="elevation-1"
            >
              <template v-slot:item.logo_url="{ item }">
                <v-img
                  v-if="item.logo_url"
                  :src="item.logo_url"
                  alt="Logo Image"
                  height="50"
                  width="50"
                ></v-img>
                <span v-else>No Logo</span>
              </template>
              <template v-slot:item.winrate="{ item }">
                <span :style="{ color: item.winrate >= 50 ? 'green' : 'red' }">
                  {{ item.winrate.toFixed(2) }}%
                </span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn @click="viewTeamMatches(item.team_id)">View Matches</v-btn>
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
import axios from 'axios';
import AppBar from '@/components/AppBar.vue';
import { useRouter } from 'vue-router';

interface Team {
  team_id: number;
  rating: number;
  wins: number;
  losses: number;
  name: string;
  tag: string;
  logo_url: string;
  winrate: number;
}

export default defineComponent({
  name: 'TeamStats',
  components: {
    AppBar
  },
  data() {
    return {
      teams: [] as Team[],
      search: '', // Initialize search string
      headers: [
        { title: 'Logo', value: 'logo_url' },
        { title: 'Rating', value: 'rating' },
        { title: 'Wins', value: 'wins' },
        { title: 'Losses', value: 'losses' },
        { title: 'Win Rate', value: 'winrate' },
        { title: 'Name', value: 'name' },
        { title: 'Tag', value: 'tag' },
        { title: 'Actions', value: 'actions', sortable: false }
      ]
    };
  },
  computed: {
    filteredTeams() {
      // Filter teams based on search string
      return this.teams.filter(team =>
        team.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {
    async viewTeamMatches(teamId: number) {
      try {
        // Navigate to TeamMatches page with teamId as parameter
        await this.$router.push({ name: 'TeamMatches', params: { teamId } });
      } catch (error) {
        console.error('Error navigating to TeamMatches:', error);
      }
    },
    async loadTeams() {
      try {
        const response = await axios.get('https://api.opendota.com/api/teams');
        this.teams = response.data.map((team: Team) => ({
          ...team,
          winrate: (team.wins / (team.wins + team.losses)) * 100
        }));
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    }
  },
  created() {
    this.loadTeams();
  }
});
</script>

<style scoped>
/* Add scoped styles if necessary */
.teams-card {
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
