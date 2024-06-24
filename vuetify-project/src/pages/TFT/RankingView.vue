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
                    data-cy="region-select"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedTier"
                    :items="tiers"
                    label="Select Tier"
                    data-cy="tier-select"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedDivision"
                    :items="divisions"
                    label="Select Division"
                    data-cy="division-select"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-btn v-if="!loading" color="primary" @click="loadData" data-cy="load-button">Load</v-btn>
                <div v-if="loading" data-cy="loading-indicator">
                  <v-progress-circular indeterminate size="64"></v-progress-circular>
                </div>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers.value"
              :items="indexedPlayers"
              class="elevation-1"
              :items-per-page="itemsPerPage"
              :items-per-page-options="[5, 10, 15, 20]"
              data-cy="data-table"
            >
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
      loading: false,
      selectedTier: '',
      selectedDivision: '',
      regions: ['eun1', 'euw1', 'br1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'tr1', 'ru', 'ph2', 'sg2', 'th2', 'tw2', 'vn2'],
      tiers: ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'],
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
      players: [],
      itemsPerPage: 20,
      pageNumber: 1
    };
  },
  computed: {
    totalItems() {
      return this.players.length;
    },
    indexedPlayers() {
      return this.players.map((player, index) => ({
        ...player,
        index: this.itemIndex(index)
      }));
    }
  },
  methods: {
    async loadData() {
      const { selectedRegion, selectedTier, selectedDivision } = this;
      if (!selectedRegion || !selectedTier || !selectedDivision) {
        alert('Please select all filters.');
        return;
      }
      this.loading = true;
      try {
        const response = await axios.get(`http://localhost:3002/api/leaderboard/${selectedRegion}/${selectedTier}/${selectedDivision}`);
        this.players = response.data;
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        this.loading = false;
      }
    },
    itemIndex(index) {
      return (this.pageNumber - 1) * this.itemsPerPage + index + 1;
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
