<template>
  <v-app>
    <AppBar />
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="text-center">
              <v-card-title>Profile Picture</v-card-title>
              <v-img :src="profileIconUrl" aspect-ratio="1"></v-img>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="text-center">
              <v-card-title>User Info</v-card-title>
              <v-card-text>
                <div>
                  <div><strong>TagLine:</strong> {{ userInfo.tagLine }}</div>
                  <div><strong>Summoner Name:</strong> {{ userInfo.name }}</div>
                  <div><strong>Summoner Level:</strong> {{ userInfo.summonerLevel }}</div>
                </div>
              </v-card-text>
            </v-card>
            <v-card class="text-center">
              <v-card-title>League Info</v-card-title>
              <v-card-text>
                <div v-for="(league, index) in userInfo.leagueData" :key="index">
                  <div><strong>Queue Type:</strong> {{ league.queueType }}</div>
                  <div><strong>Tier:</strong> {{ league.tier }}</div>
                  <div><strong>Rank:</strong> {{ league.rank }}</div>
                  <div><strong>League Points:</strong> {{ league.leaguePoints }}</div>
                  <div><strong>Wins:</strong> {{ league.wins }}</div>
                  <div><strong>Losses:</strong> {{ league.losses }}</div>
                  <hr/>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="text-center">
              <v-card-title>Search</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="searchQuery"
                  label="Search"
                  outlined
                  dense
                  hide-details
                  @keyup.enter="searchForPlayer"
                ></v-text-field>
              </v-card-text>
            </v-card>
            <v-card class="text-center">
              <v-card-title>Graph</v-card-title>
              <v-card-text>
                <canvas ref="winLossGraph" class="graph-placeholder"></canvas>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="recent-games-table text-center">
          <v-col cols="12">
            <v-card>
              <v-card-title>Recent Games</v-card-title>
              <v-card-text>
                <v-row class="header-row">
                  <v-col v-for="(header, index) in recentGamesHeaders" :key="index" cols="1.5">
                    <div class="header-cell">
                      {{ header }}
                    </div>
                  </v-col>
                </v-row>
                <v-row v-for="(row, rowIndex) in recentGamesData" :key="rowIndex">
                  <v-col v-for="(content, colIndex) in row" :key="colIndex" cols="1.5">
                    <div class="content-cell">
                      <div v-if="Array.isArray(content)">
                        <div v-for="(augment, i) in content" :key="i" class="augment">
                          <div>{{ formatAugment(augment) }}</div>
                        </div>
                      </div>
                      <div v-else>
                        {{ content }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import AppBar from '@/components/AppBar.vue';

Chart.register(...registerables);

export default defineComponent({
  name: 'StatsView',
  components: {
    AppBar
  },
  data() {
    return {
      searchQuery: '',
      profileIconUrl: '',
      userInfo: {
        name: '',
        summonerLevel: 0,
        tagLine: '',
        leagueData: []
      },
      recentGamesHeaders: ['Game Number', 'Gold Left', 'Level', 'Placement', 'Players Eliminated', 'Total Damage', 'Augments'],
      recentGamesData: []
    };
  },
  methods: {
    async searchForPlayer() {
      const [name, tag] = this.searchQuery.split('#');
      try {
        console.log(`Fetching data for ${name}#${tag}`);
        const response = await axios.get(`http://localhost:3003/api/summoner/${name}/${tag}`);
        console.log('Response data:', response.data);
        this.userInfo.name = response.data.gameName;
        this.userInfo.summonerLevel = response.data.summonerLevel;
        this.userInfo.tagLine = response.data.tagLine;
        this.userInfo.leagueData = response.data.leagueData;
        this.profileIconUrl = `http://ddragon.leagueoflegends.com/cdn/11.24.1/img/profileicon/${response.data.profileIconId}.png`;
        
        // Processing recent games
        this.recentGamesData = response.data.matchDetails.map((match, index) => {
          const participant = match.matchDetails.info.participants.find(p => p.puuid === response.data.puuid);
          if (participant) {
            return [
              index + 1,
              participant.gold_left,
              participant.level,
              participant.placement,
              participant.players_eliminated,
              participant.total_damage_to_players,
              participant.augments // Only include augment names
            ];
          } else {
            console.error('Participant not found for current user in match:', match.matchId);
            return [];
          }
        });

        // Render win/loss graph
        this.renderWinLossGraph();
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    },
    formatAugment(augment) {
      const parts = augment.split('_');
      const lastPart = parts[parts.length - 1];
      const formatted = lastPart.replace(/([A-Z])/g, ' $1').trim();
      return formatted;
    },
    renderWinLossGraph() {
      const ctx = (this.$refs.winLossGraph as HTMLCanvasElement).getContext('2d');
      const winLossData = this.userInfo.leagueData.reduce(
        (acc, league) => {
          acc.wins += league.wins;
          acc.losses += league.losses;
          return acc;
        },
        { wins: 0, losses: 0 }
      );

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Wins', 'Losses'],
          datasets: [
            {
              label: 'Win/Loss Ratio',
              data: [winLossData.wins, winLossData.losses],
              backgroundColor: ['#4caf50', '#f44336'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              enabled: true,
            }
          }
        }
      });
    }
  }
});
</script>

<style scoped>
.text-center {
  text-align: center;
}

.header-cell {
  font-weight: bold;
}

.content-cell {
  padding: 8px;
}

.graph-placeholder {
  height: 400px;
}

.recent-games-table .v-card {
  width: 1200px; /* Increase the width of the table */
}
</style>
