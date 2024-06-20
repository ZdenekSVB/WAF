<template>
  <v-app>
    <AppBar />
    <v-main>
      <v-img
        class="background"

        alt="Background"
      />
      <div class="search-field">
        <v-text-field
          v-model="gameName"
          label="Game Name"
          outlined
          class="mx-auto"
          dense
          hide-details
        ></v-text-field>
        <v-text-field
          v-model="tagLine"
          label="Tag Line"
          outlined
          class="mx-auto"
          dense
          hide-details
          @keyup.enter="fetchPUUID"
        ></v-text-field>
      </div>
      <div v-if="userData">
        <h2>User Data:</h2>
        <pre>{{ userData }}</pre>
      </div>
    </v-main>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import AppBar from '@/components/AppBar.vue'; // Adjust the path as needed

export default defineComponent({
  name: 'SearchView',
  components: {
    AppBar
  },
  data() {
    return {
      gameName: '',
      tagLine: '',
      userData: null
    };
  },
  methods: {
    async fetchPUUID() {
      const gameName = this.gameName;
      const tagLine = this.tagLine;

      if (!gameName || !tagLine) {
        alert('Please enter both Game Name and Tag Line');
        return;
      }

      try {
        const puuidResponse = await axios.get(`http://localhost:3002/api/getPUUID/${gameName}/${tagLine}`);
        const puuid = puuidResponse.data.puuid;
        this.fetchUserData(puuid);
      } catch (error) {
        console.error('Error fetching PUUID:', error);
        alert('Error fetching PUUID. Please try again.');
      }
    },
    async fetchUserData(puuid: string) {
      try {
        const response = await axios.get(`http://localhost:3002/api/getSummonerData/${puuid}`);
        this.userData = response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Error fetching user data. Please try again.');
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
