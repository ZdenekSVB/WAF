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

export default defineComponent({
  name: 'RankingView',
  data() {
    return {
      headers: ['#', 'Summoner', 'Tier', 'LP', 'Game'],
      rows: [
        ['#1', 'Summoner 1', 'Diamond', '90 LP', 'League of Legends'],
        ['#2', 'Summoner 2', 'Gold', '75 LP', 'Valorant'],
        ['#3', 'Summoner 3', 'Platinum', '82 LP', 'Apex Legends'],
        // Add more rows as needed
      ]
    };
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
