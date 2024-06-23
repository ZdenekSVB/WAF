<template>
  <v-app>
    <AppBar :currentCategory="'TFT'" />
    <v-main>        
      <v-container>
        <v-card>
          <v-card-title>Select Filters and Load Data</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-row>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedRegion"
                    :items="regions"
                    label="Select Region"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedTier"
                    :items="tiers"
                    label="Select Tier"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedDivision"
                    :items="divisions"
                    label="Select Division"
                  ></v-select>
                </v-col>
              </v-row>
              <v-btn v-if="!loading" color="primary" @click="loadData">Load</v-btn>
              <div v-if="loading">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </div>
            </v-form>
            <v-data-table
              :headers="headers"
              :items="players"
              class="elevation-1"
            >
              <template v-slot:item.index="{ index }">
                <span>{{ index + 1 }}</span>
              </template>
            </v-data-table>

          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
    <router-view />
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedRegion: '',
      loading: false,  // Add loading state
      selectedTier: '',
      selectedDivision: '',
      regions: [    'eun1', 'euw1', 'br1', 'jp1', 'kr', 'la1', 'la2','na1', 'oc1', 'tr1', 'ru', 'ph2', 'sg2', 'th2','tw2', 'vn2'  ],
      tiers: [
        'IRON', 'BRONZE', 'SILVER', 'GOLD', 
        'PLATINUM', 'DIAMOND'
      ],
      divisions: ['I', 'II', 'III', 'IV'],
      headers: [
        { text: '#', value: 'index' },
        { text: 'Summoner Name', value: 'summonerName' },
        { text: 'Tier', value: 'tier' },
        { text: 'Rank', value: 'rank' },
        { text: 'LP', value: 'leaguePoints' },
        { text: 'Wins', value: 'wins' },
        { text: 'Losses', value: 'losses' }
      ],
      players: []
    };
  },
  methods: {
    async loadData() {
      this.loading = true;
      const { selectedRegion, selectedTier, selectedDivision } = this;
      if (!selectedRegion || !selectedTier || !selectedDivision) {
        alert('Please select all filters.');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3003/api/leaderboard/${selectedRegion}/${selectedTier}/${selectedDivision}`);
        this.players = response.data;
      } catch (error) {
        console.error('Error loading data:', error);
        this.loading = false;
      }finally{
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.header-row {
  border-bottom: 1px solid #ccc;
  font-weight: bold;
}
.header-cell {
  padding: 10px;
}
.content-cell {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>
