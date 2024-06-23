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
import { useRoute, useRouter } from 'vue-router';
import NavBar from '@/pages/DOTA/NavBar.vue';
import { VApp, VMain, VContainer, VRow, VCol, VCard, VImg, VCardTitle, VCardSubtitle, VList, VListItem, VListItemTitle, VListItemSubtitle, VDataTable, VCardText } from 'vuetify/components';
// Ensure you import the necessary Vuetify components


export default defineComponent({
  name: 'AccountView',
  components: {
    NavBar,
    VApp,
    VMain,
    VContainer,
    VRow,
    VCol,
    VCard,
    VImg,
    VCardTitle,
    VCardSubtitle,
    VList,
    VListItem,
    VListItemTitle,
    VListItemSubtitle,
    VDataTable,
    VCardText
  },
  data() {
    return {
      profile: null,
      stats: [],
      matches: [],
      heroes: [],
      headers: [
        { text: 'Statistic', align: 'start', sortable: false, value: 'stat' },
        { text: 'Value', value: 'value' },
      ],
      matchesHeaders: [
        { text: 'Match ID', value: 'match_id' },
        { text: 'Hero ID', value: 'hero_id' },
        { text: 'Kills', value: 'kills' },
        { text: 'Deaths', value: 'deaths' },
        { text: 'Assists', value: 'assists' },
        { text: 'Duration', value: 'duration' },
        { text: 'Result', value: 'result' },
      ],
      heroesHeaders: [
        { text: 'Hero ID', value: 'hero_id' },
        { text: 'Games Played', value: 'games' },
        { text: 'Wins', value: 'win' },
        { text: 'Win Rate', value: 'win_rate' },
      ],
    };
  },
  async beforeRouteEnter(to, from, next) {
    try {
      const API_URL = "https://api.opendota.com/api/players";
      const accountId = to.params.accountId;
      const [playerRes, wlRes, matchesRes, heroesRes] = await Promise.all([
        axios.get(`${API_URL}/${accountId}`),
        axios.get(`${API_URL}/${accountId}/wl`),
        axios.get(`${API_URL}/${accountId}/matches`),
        axios.get(`${API_URL}/${accountId}/heroes`)
      ]);

      const playerData = playerRes.data;
      const wlData = wlRes.data;
      const matchesData = matchesRes.data;
      const heroesData = heroesRes.data;

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
.stats-card, .matches-card, .heroes-card {
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
