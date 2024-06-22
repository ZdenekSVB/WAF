<template>
  <v-app>
    <AppBar />
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Profile Picture</v-card-title>
              <v-img :src="profileIconUrl" aspect-ratio="1"></v-img>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>User Info</v-card-title>
              <v-card-text>
                <div>
                  <div><strong>TagLine:</strong> {{ userInfo.tagLine }}</div>
                  <div><strong>Summoner Name:</strong> {{ userInfo.name }}</div>
                  <div><strong>Summoner Level:</strong> {{ userInfo.summonerLevel }}</div>
                </div>
              </v-card-text>
            </v-card>
            <v-card>
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
        summonerLevel: 0,
        tagLine: '',
        leagueData: []
      },
      statsHeaders: ['Synergy', 'Matches', 'Avg Place'],
      statsData: [
        ['Data 1', 'Data 2', 'Data 3'],
      ],
      recentGamesHeaders: ['Place', 'Stage', 'Synergy', 'Augment', 'Champs', 'Gold/Kills/DMG'],
      recentGamesData: [
        ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5', 'Data 6'],
      ]
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
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    }
  }
})
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
  margin-bottom: 20px;
}

.recent-games-table {
  margin-top: 20px;
}
</style>
