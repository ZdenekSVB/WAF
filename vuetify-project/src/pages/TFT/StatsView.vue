<template>
  <v-app>
    <AppBar :currentCategory="'TFT'" />
    <v-main>
      <v-container>
        <v-row>
          <!-- Left Column -->
          <v-col cols="12" md="4">
            <v-card class="text-center">
              <v-card-title>Profile Picture</v-card-title>
              <v-img :src="profileIconUrl" aspect-ratio="1" v-if="profileIconUrl"></v-img>
              <v-card-text v-else>
                No profile picture available
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Middle Column -->
          <v-col cols="12" md="4">
            <!-- User Info Card -->
            <v-card class="text-center">
              <v-card-title>User Info</v-card-title>
              <v-card-text>
                <div v-if="userInfo.name">
                  <div><strong>TagLine:</strong> {{ userInfo.tagLine }}</div>
                  <div><strong>Summoner Name:</strong> {{ userInfo.name }}</div>
                  <div><strong>Summoner Level:</strong> {{ userInfo.summonerLevel }}</div>
                </div>
                <div v-else>
                  No user information available
                </div>
              </v-card-text>
            </v-card>

            <!-- League Info Card -->
            <v-card class="text-center">
              <v-card-title>League Info</v-card-title>
              <v-card-text>
                <div v-if="userInfo.leagueData.length">
                  <div v-for="(league, index) in userInfo.leagueData" :key="index">
                    <div><strong>Queue Type:</strong> {{ league.queueType }}</div>
                    <div><strong>Tier:</strong> {{ league.tier }}</div>
                    <div><strong>Rank:</strong> {{ league.rank }}</div>
                    <div><strong>League Points:</strong> {{ league.leaguePoints }}</div>
                    <div><strong>Wins:</strong> {{ league.wins }}</div>
                    <div><strong>Losses:</strong> {{ league.losses }}</div>
                    <hr />
                  </div>
                </div>
                <div v-else>
                  No league information available
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Right Column -->
          <v-col cols="12" md="4">
            <!-- Search Card -->
            <v-card class="text-center">
              <v-card-title>Search</v-card-title>
              <v-card-text>
                <v-text-field v-if="!loading"
                  v-model="searchQuery"
                  label="Search"
                  outlined
                  dense
                  hide-details
                  @keyup.enter="searchForPlayer"
                ></v-text-field>
                <div v-if="loading">
                  <v-progress-circular indeterminate size="64"></v-progress-circular>
                </div>
              </v-card-text>
            </v-card>

            <!-- Summary Card -->
            <v-card class="text-center">
              <v-card-title>Win/Loss Summary</v-card-title>
              <v-card-text>
                <div v-if="loadSummary">
                  <div><strong>Total Wins:</strong> {{ summaryData.wins }}</div>
                  <div><strong>Total Losses:</strong> {{ summaryData.losses }}</div>
                  <div><strong>Win Ratio:</strong> {{ winRatio }}%</div>
                </div>
                <div v-else>
                  No summary data available
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Games Table -->
        <v-row class="recent-games-table text-center">
          <v-col cols="12">
            <v-card>
              <v-card-title>Recent Games</v-card-title>
              <v-card-text>
                <div v-if="recentGamesData.length">
                  <v-row class="header-row">
                    <v-col v-for="(header, index) in recentGamesHeaders" :key="index" cols="1.5">
                      <div class="header-cell">{{ header }}</div>
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
                        <div v-else>{{ content }}</div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <div v-else>
                  No recent games data available
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import axios from 'axios';
import AppBar from '@/components/AppBar.vue';

export default defineComponent({
  name: 'TFTStatsView',
  components: {
    AppBar
  },
  setup() {
    const searchQuery = ref('');
    const profileIconUrl = ref('');
    const userInfo = ref({
      name: '',
      summonerLevel: 0,
      tagLine: '',
      leagueData: []
    });
    const recentGamesHeaders = ref(['Game Number', 'Gold Left', 'Level', 'Placement', 'Players Eliminated', 'Total Damage', 'Augments']);
    const recentGamesData = ref([]);
    const loading = ref(false);
    const loadSummary = ref(false);
    const summaryData = ref({ wins: 0, losses: 0 });
    const error = ref('');

    const searchForPlayer = async () => {
      const validTag = ['EUN1', 'EUW1', 'BR1', 'JP1', 'KR', 'LA1', 'LA2', 'NA1', 'OC1', 'TR1', 'RU', 'PH2', 'SG2', 'TH2', 'TW2', 'VN2'];
      const trimmedQuery = searchQuery.value.trim();
      const [name, tag] = trimmedQuery.split('#');

      if (!name || !tag || !validTag.includes(tag)) {
        alert('Please enter a valid search query in the format NAME#TAG');
        return;
      }

      error.value = '';
      loading.value = true;
      try {
        const response = await axios.get(`http://localhost:3003/api/summoner/${name}/${tag}`);

        userInfo.value.name = response.data.gameName;
        userInfo.value.summonerLevel = response.data.summonerLevel;
        userInfo.value.tagLine = response.data.tagLine;
        userInfo.value.leagueData = response.data.leagueData;
        profileIconUrl.value = `http://ddragon.leagueoflegends.com/cdn/11.24.1/img/profileicon/${response.data.profileIconId}.png`;

        recentGamesData.value = response.data.matchDetails.map((match, index) => {
          const participant = match.matchDetails.info.participants.find(p => p.puuid === response.data.puuid);
          if (participant) {
            return [
              index + 1,
              participant.gold_left,
              participant.level,
              participant.placement,
              participant.players_eliminated,
              participant.total_damage_to_players,
              participant.augments
            ];
          } else {
            return [];
          }
        });
      } catch (error) {
        alert('Summoner not found. Please enter a valid summoner name and tag.');
        console.error('Error fetching player data:', error);
      } finally {
        loading.value = false;
        loadSummaryData();
      }
    };

    const formatAugment = (augment: string) => {
      const parts = augment.split('_');
      const lastPart = parts[parts.length - 1];
      const formatted = lastPart.replace(/([A-Z])/g, ' $1').trim();
      return formatted;
    };

    const loadSummaryData = () => {
      const winLossData = userInfo.value.leagueData.reduce(
        (acc, league) => {
          acc.wins += league.wins;
          acc.losses += league.losses;
          return acc;
        },
        { wins: 0, losses: 0 }
      );
      summaryData.value = winLossData;
      loadSummary.value = true;
    };

    const winRatio = computed(() => {
      const totalGames = summaryData.value.wins + summaryData.value.losses;
      return totalGames > 0 ? ((summaryData.value.wins / totalGames) * 100).toFixed(2) : '0';
    });

    onMounted(() => {
      const search = new URLSearchParams(window.location.search).get('search');
      if (search) {
        searchQuery.value = search;
        searchForPlayer();
      }
    });

    return {
      searchQuery,
      profileIconUrl,
      userInfo,
      recentGamesHeaders,
      recentGamesData,
      loading,
      loadSummary,
      summaryData,
      error,
      searchForPlayer,
      formatAugment,
      loadSummaryData,
      winRatio
    };
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

.recent-games-table .v-card {
  width: 1200px;
}
</style>
