<template>
  <v-app>
    <AppBar />
    <v-main>
      <v-img class="background" alt="Background" />
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
        <v-btn @click="fetchPUUID" class="mx-auto">Search</v-btn>
      </div>
    </v-main>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useLolStore } from '@/stores/lolStore';
import AppBar from '@/components/AppBar.vue';

export default defineComponent({
  name: 'LOLSearchView',
  components: {
    AppBar
  },
  setup() {
    const gameName = ref('');
    const tagLine = ref('');
    const router = useRouter();
    const lolStore = useLolStore();

    const fetchPUUID = async () => {
      if (!gameName.value || !tagLine.value) {
        alert('Please enter both Game Name and Tag Line');
        return;
      }

      try {
        const puuidResponse = await axios.get(`http://localhost:3002/api/getPUUID/${gameName.value}/${tagLine.value}`);
        const puuid = puuidResponse.data.puuid;
        await fetchUserData(puuid);
        navigateToAccountView();
      } catch (error) {
        console.error('Error fetching PUUID:', error);
        alert('Error fetching PUUID. Please try again.');
      }
    };

    const fetchUserData = async (puuid: string) => {
      try {
        const response = await axios.get(`http://localhost:3002/api/getSummonerData/${puuid}`);
        lolStore.setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Error fetching user data. Please try again.');
      }
    };

    const navigateToAccountView = () => {
      router.push({ name: 'LOLAccount' });
    };

    return {
      gameName,
      tagLine,
      fetchPUUID
    };
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
