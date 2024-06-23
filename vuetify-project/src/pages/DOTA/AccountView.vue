<template>
  <v-app>
    <v-main>
      <div v-if="profile" class="profile-container">
        <img :src="profile.avatarfull" alt="Profile Image" class="profile-image" />
        <p><strong>Competitive Rank:</strong> {{ competitive_rank }}</p>
        <p><strong>Solo Competitive Rank:</strong> {{ solo_competitive_rank }}</p>
        <p><strong>Rank Tier:</strong> {{ rank_tier }}</p>
        <p><strong>Leaderboard Rank:</strong> {{ leaderboard_rank }}</p>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'AccountView',
  data() {
    return {
      profile: null,
      solo_competitive_rank: null,
      competitive_rank: null,
      rank_tier: null,
      leaderboard_rank: null,
    };
  },
  async beforeRouteEnter(to, from, next) {
    try {
      const API_URL = "https://api.opendota.com/api/players";
      const accountId = to.params.accountId;
      const response = await axios.get(`${API_URL}/${accountId}`);
      const playerData = response.data;
      next(vm => {
        vm.profile = playerData.profile;
        vm.solo_competitive_rank = playerData.solo_competitive_rank;
        vm.competitive_rank = playerData.competitive_rank;
        vm.rank_tier = playerData.rank_tier;
        vm.leaderboard_rank = playerData.leaderboard_rank;
      });
    } catch (error) {
      console.error('Error fetching player data:', error);
      next(false); // cancel navigation on error
    }
  }
});
</script>

<style scoped>
.profile-container {
  text-align: center;
  padding: 20px;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

h1 {
  margin-top: 10px;
}

p {
  margin: 5px 0;
}
</style>
