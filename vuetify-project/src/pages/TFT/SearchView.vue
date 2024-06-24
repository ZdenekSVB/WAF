<template>
  <v-app>
    <AppBar :currentCategory="'TFT'" />
    <div class="background"></div>
    <div class="search-field">
      <v-text-field
        v-model="searchQuery"
        label="Search"
        outlined
        dense
        hide-details
        @keyup.enter="goToStatsPage"
      ></v-text-field>
      <v-btn @click="goToStatsPage">Search</v-btn>
    </div>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import AppBar from '@/components/AppBar.vue';

export default defineComponent({
  name: 'TFTSearchView',
  components: {
    AppBar
  },
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    async goToStatsPage() {
      const validTag = ['EUN1', 'EUW1', 'BR1', 'JP1', 'KR', 'LA1', 'LA2', 'NA1', 'OC1', 'TR1', 'RU', 'PH2', 'SG2', 'TH2', 'TW2', 'VN2'];

      const trimmedQuery = this.searchQuery.trim();
      const [name, tag] = trimmedQuery.split('#');

      if (!name || !tag || !validTag.includes(tag)) {
        alert('Please enter a valid search query in the format NAME#TAG');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3003/api/summoner/${name}/${tag}`);
        if (response.data) {
          this.$router.push({ name: 'TFTStats', query: { search: trimmedQuery } });
        }
      } catch (error) {
        alert('Summoner not found. Please enter a valid summoner name and tag.');
        console.error('Error fetching summoner data:', error);
      }
    }
  }
});
</script>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
}

.search-field {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 80%;
  max-width: 400px;
}
</style>
