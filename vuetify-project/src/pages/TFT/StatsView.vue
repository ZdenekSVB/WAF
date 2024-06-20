<template>
  <v-app>
    <AppBar />

    <v-main>
      <v-container>
        <!-- Top row -->
        <v-row>
          <!-- Column 1: Profile pic and graph -->
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Profile Picture</v-card-title>
              <v-img :src="profileIconUrl" aspect-ratio="1"></v-img>
            </v-card>
          </v-col>

          <!-- Column 2: UserInfo frame and stats table -->
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>User Info</v-card-title>
              <v-card-text>
                <div>
                  <div><strong>Summoner Name:</strong> {{ userInfo.name }}</div>
                  <div><strong>Summoner Level:</strong> {{ userInfo.summonerLevel }}</div>
                </div>
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-title>Stats</v-card-title>
              <v-card-text>
                <v-row class="header-row">
                  <v-col v-for="(header, index) in statsHeaders" :key="index" cols="4">
                    <div class="header-cell">
                      {{ header }}
                    </div>
                  </v-col>
                </v-row>
                <!-- Use v-for to dynamically generate rows -->
                <v-row v-for="(row, rowIndex) in statsData" :key="rowIndex">
                  <v-col v-for="(content, colIndex) in row" :key="colIndex" cols="4">
                    <div class="content-cell">
                      {{ content }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Column 3: Search bar with graph placeholder -->
          <v-col cols="12" md="4">
            <v-card>
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
            <v-card>
              <v-card-title>Graph</v-card-title>
              <v-card-text>
                <div class="graph-placeholder">
                  Graph Placeholder
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Bottom row: Recent games table -->
        <v-row class="recent-games-table">
          <v-col cols="12">
            <v-card>
              <v-card-title>Recent Games</v-card-title>
              <v-card-text>
                <v-row class="header-row">
                  <v-col v-for="(header, index) in recentGamesHeaders" :key="index" cols="2">
                    <div class="header-cell">
                      {{ header }}
                    </div>
                  </v-col>
                </v-row>
                <!-- Use v-for to dynamically generate rows -->
                <v-row v-for="(row, rowIndex) in recentGamesData" :key="rowIndex">
                  <v-col v-for="(content, colIndex) in row" :key="colIndex" cols="2">
                    <div class="content-cell">
                      {{ content }}
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
import AppBar from '@/components/AppBar.vue';

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
        summonerLevel: 0
      },
      statsHeaders: ['Synergy', 'Matches', 'Avg Place'],
      statsData: [
        ['Data 1', 'Data 2', 'Data 3'],
        // Add more rows as needed
      ],
      recentGamesHeaders: ['Place', 'Stage', 'Synergy', 'Augment', 'Champs', 'Gold/Kills/DMg'],
      recentGamesData: [
        ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5', 'Data 6'],
        // Add more rows as needed
      ]
    };
  },
  methods: {
    async searchForPlayer() {
      const API_URL = "http://localhost:3002/api/getPUUID";

      if (this.searchQuery.trim() === '') {
        alert('Please enter a summoner name.');
        return;
      }

      try {
        const [gameName, tagLine] = this.searchQuery.split('#');
        if (!gameName || !tagLine) {
          alert('Please enter the full Riot ID in the format: name#tag');
          return;
        }

        const response = await axios.get(`${API_URL}/${gameName}/${tagLine}`);
        const playerData = response.data;

        if (playerData.puuid) {
          const tftDataResponse = await axios.get(`http://localhost:3002/api/getTFTData/${playerData.puuid}`);
          const tftData = tftDataResponse.data;

          this.userInfo = {
            name: gameName ,
            summonerLevel: tftData.summonerLevel
          };
          this.profileIconUrl = `http://ddragon.leagueoflegends.com/cdn/11.9.1/img/profileicon/${tftData.profileIconId}.png`;
        } else {
          alert('Player not found.');
        }
      } catch (error) {
        console.error(error);
        alert('Error fetching player data. Please try again.');
      }
    }
  }
});
</script>

<style scoped>
.info-placeholder,
.graph-placeholder {
  color: black;
  height: 150px;
  margin-bottom: 10px;
  background-color: #eee;
}

.header-cell,
.content-cell {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.header-row {  
  font-weight: bold;
}

.stats-table {
  margin-bottom: 20px; /* Adjust margin between sections */
}

.recent-games-table {
  margin-top: 20px; /* Adjust margin between sections */
}
</style>
