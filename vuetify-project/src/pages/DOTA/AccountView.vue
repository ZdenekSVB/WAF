<template>
  <v-app>
    <NavBar />
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="profile-card" elevation="2">
              <v-img :src="profile.avatarfull" alt="Profile Image" class="profile-image"></v-img>
              <v-card-title>{{ profile.personaname }}</v-card-title>
              <v-card-subtitle>{{ profile.profileurl }}</v-card-subtitle>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Steam ID</v-list-item-title>
                    <v-list-item-subtitle>{{ profile.steamid }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Plus Member</v-list-item-title>
                    <v-list-item-subtitle>{{ profile.plus }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Country Code</v-list-item-title>
                    <v-list-item-subtitle>{{ profile.loccountrycode }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
            <v-card class="peers-card" elevation="2" v-if="peers.length">
              <v-card-title>Top Peers</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="peersHeaders"
                  :items="peers"
                  class="elevation-1"
                >
                  <template v-slot:item.avatarfull="{ item }">
                    <v-img :src="item.avatarfull" alt="Peer Profile Pic" class="peer-avatar"></v-img>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="8">
            <v-card class="stats-card" elevation="2">
              <v-card-title>Player Statistics</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="stats"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-card>
            <v-card class="matches-card" elevation="2" v-if="matches.length">
              <v-card-title>Recent Matches</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="matchesHeaders"
                  :items="matches"
                  class="elevation-1"
                  @click:row="goToMatchDetail"
                ></v-data-table>
              </v-card-text>
            </v-card>
            <v-card class="heroes-card" elevation="2" v-if="heroes.length">
              <v-card-title>Heroes</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="heroesHeaders"
                  :items="heroes"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import NavBar from '@/pages/DOTA/NavBar.vue';

export default defineComponent({
  name: 'AccountView',
  components: {
    NavBar,
  },
  data() {
    return {
      profile: null,
      stats: [],
      matches: [],
      heroes: [],
      peers: [],
      headers: [
        { text: 'Statistic', align: 'start', sortable: false, value: 'stat' },
        { text: 'Value', value: 'value' },
      ],
      matchesHeaders: [
        { title: 'Match ID', value: 'match_id' },
        { title: 'Hero ID', value: 'hero_id' },
        { title: 'Kills', value: 'kills' },
        { title: 'Deaths', value: 'deaths' },
        { title: 'Assists', value: 'assists' },
        { title: 'Duration', value: 'duration' },
        { title: 'Result', value: 'result' },
      ],
      heroesHeaders: [
        { title: 'Hero ID', value: 'hero_id' },
        { title: 'Games Played', value: 'games' },
        { title: 'Wins', value: 'win' },
        { title: 'Win Rate', value: 'win_rate' },
      ],
      peersHeaders: [
        { title: 'Peer Name', value: 'personaname' },
        { title: 'Games Played', value: 'games' },
        { title: 'Win Rate', value: 'win_rate' },
        { title: 'Profile Pic', value: 'avatarfull' }
      ],
    };
  },
  async beforeRouteEnter(to, from, next) {
    try {
      const API_URL = "https://api.opendota.com/api/players";
      const accountId = to.params.accountId;
      const [playerRes, wlRes, matchesRes, heroesRes, peersRes] = await Promise.all([
        axios.get(`${API_URL}/${accountId}`),
        axios.get(`${API_URL}/${accountId}/wl`),
        axios.get(`${API_URL}/${accountId}/matches`),
        axios.get(`${API_URL}/${accountId}/heroes`),
        axios.get(`${API_URL}/${accountId}/peers?limit=10`)
      ]);

      const playerData = playerRes.data;
      const wlData = wlRes.data;
      const matchesData = matchesRes.data;
      const heroesData = heroesRes.data;
      const peersData = peersRes.data;

      next(vm => {
        vm.profile = playerData.profile;
        vm.stats = [
          { stat: 'Name', value: playerData.profile.name },
          { stat: 'Competitive Rank', value: playerData.competitive_rank },
          { stat: 'Solo Competitive Rank', value: playerData.solo_competitive_rank },
          { stat: 'Rank Tier', value: playerData.rank_tier },
          { stat: 'Leaderboard Rank', value: playerData.leaderboard_rank },
          { stat: 'Wins', value: wlData.win },
          { stat: 'Losses', value: wlData.lose },
        ];
        vm.matches = matchesData.map(match => ({
          ...match,
          result: match.radiant_win ? 'Win' : 'Lose'
        }));
        vm.heroes = heroesData.map(hero => ({
          ...hero,
          win_rate: hero.games ? ((hero.win / hero.games) * 100).toFixed(2) + '%' : '0%'
        }));
        vm.peers = peersData.map(peer => ({
          ...peer,
          win_rate: peer.games ? ((peer.with_win / peer.with_games) * 100).toFixed(2) + '%' : '0%'
        }));
      });
    } catch (error) {
      console.error('Error fetching player data:', error);
      next(false); // cancel navigation on error
    }
  },
  methods: {
    goToMatchDetail(item) {
      this.$router.push({ name: 'MatchDetail', params: { matchId: item.match_id } });
    }
  }
});
</script>

<style scoped>
/* Add scoped styles if necessary */
.profile-card {
  transition: transform 0.2s ease-in-out;
}
.profile-card:hover {
  transform: scale(1.05);
}
.stats-card, .matches-card, .heroes-card, .peers-card {
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
.peer-avatar {
  width: 50px; /* Adjust size as needed */
  height: 50px; /* Adjust size as needed */
  border-radius: 50%;
}
.v-data-table__row {
  transition: background-color 0.3s ease;
}
.v-data-table__row:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
