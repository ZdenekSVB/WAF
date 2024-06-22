<template>
  <v-app>
    <AppBar />
    
    <v-main>
      <v-container>
        <v-card>
          <v-card-text>
            <v-row class="header-row">
              <v-col v-for="(header, index) in headers" :key="index" cols="2">
                <div class="header-cell">
                  {{ header }}
                </div>
              </v-col>
            </v-row>
            
            <!-- Use v-for to dynamically generate rows -->
            <v-row v-for="(row, rowIndex) in rows" :key="rowIndex">
              <v-col v-for="(content, colIndex) in row" :key="colIndex" cols="2">
                <div class="content-cell">
                  {{ content }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'RankingView',
  data() {
    return {
      headers: ['#', 'Summoner', 'Tier', 'LP', 'Wins', 'Losses'],
      rows: []
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3003/api/ranking');
      this.rows = response.data.map((summoner, index) => [
        `#${index + 1}`,
        `${summoner.summonerName}#${summoner.tagLine}`,
        'Diamond I',
        `${summoner.leaguePoints} LP`,
        `${summoner.wins} Wins`,
        `${summoner.losses} Losses`
      ]);
    } catch (error) {
      console.error('Error fetching ranking data:', error);
    }
  }
});
</script>

<style scoped>
.header-row {
  border-bottom: 1px solid #ccc; /* Bottom border for header row */
  font-weight: bold;
}

.header-cell {
  padding: 10px;
}

.content-cell {
  padding: 10px;
  border-bottom: 1px solid #eee; /* Bottom border for content rows */
}
</style>
