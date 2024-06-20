<template>
  <v-app>
    <AppBar />

    <v-main>
      <v-img
        class="background"
        src="@/assets/tftbackground.png"
        alt="Background"
      />
      <div class="search-field">
        <v-text-field
          v-model="searchQuery"
          label="Search"
          outlined
          class="mx-auto"
          dense
          hide-details
          @keyup.enter="searchForPlayer"
        ></v-text-field>
      </div>
    </v-main>

    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'SearchView',
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    async searchForPlayer() {
      const API_URL = "http://localhost:3001/api/summoner";

      if (this.searchQuery.trim() === '') {
        alert('Please enter a summoner name.');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/${this.searchQuery}`);
        const playerData = response.data;
        console.log(playerData);
        // Here you can handle the player data, for example redirect to another view or show data in the UI
      } catch (error) {
        console.error(error);
        alert('Error fetching player data. Please try again.');
      }
    },
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
  z-index: 10; /* Ensures search bar is above the background */
  width: 80%; /* Adjust width as needed */
  max-width: 400px; /* Adjust max-width as needed */
}
</style>
