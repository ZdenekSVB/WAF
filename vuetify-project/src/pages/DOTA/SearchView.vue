<template>
  <v-app>
    <AppBar :currentCategory="'DOTA'"/>

    <v-main>
      <div class="search-field">
        <v-text-field
          v-model="searchQuery"
          label="Please enter your Dota Account ID"
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
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SearchView',
  setup() {
    const router = useRouter();
    const searchQuery = ref('');

    const searchForPlayer = async () => {
      if (searchQuery.value.trim() === '') {
        alert('Please enter an account ID.');
        return;
      }

      const accountId = searchQuery.value.trim();

      try {
        const API_URL = "https://api.opendota.com/api/players";
        const response = await axios.get(`${API_URL}/${accountId}`);

        // Check if player was found successfully
        if (response.status === 200) {
          await router.push({ name: 'AccountView', params: { accountId } });
        } else {
          alert('Player not found. Please try again.');
        }
      } catch (error) {
        console.error('Error searching for player:', error);
        alert('Error searching for player. Please try again.');
      }
    };

    return {
      searchQuery,
      searchForPlayer
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
