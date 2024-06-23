<template>
  <v-app>
    <AppBar />
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Profile Picture</v-card-title>
              <v-img :src="userInfo.profileIconURL" aspect-ratio="1"></v-img>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>User Info</v-card-title>
              <v-card-text>
                <div>
                  <div><strong>Summoner Name:</strong> {{ userInfo.name }}</div>
                  <div><strong>Summoner Level:</strong> {{ userInfo.summonerLevel }}</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Search</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="searchQuery"
                  label="Search"
                  outlined
                  dense
                  hide-details
                  @keyup.enter="searchForPlayer"
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <router-view />
  </v-app>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useLolStore } from '@/stores/lolStore';
import { fetchUserData } from '@/pages/LOL/lolService';
import AppBar from '@/components/AppBar.vue';
export default defineComponent({
  name: 'LOLAccountView',
  components: {
    AppBar
  },
  data() {
    return {
      searchQuery: ''
    };
  },
  setup() {
    const lolStore = useLolStore();
    const userInfo = computed(() => lolStore.getUserData);

    return {
      userInfo,
      lolStore
    };
  },
  methods: {
    async searchForPlayer() {
      const [gameName, tagLine] = this.searchQuery.split('#');
      if (!gameName || !tagLine) {
        alert('Please enter the full Riot ID in the format: name#tag');
        return;
      }
      const userData = await fetchUserData(gameName, tagLine);
      if (userData) {
        console.log(`Received nickname: ${userData.name}`);
        console.log(`Received profileIconID: ${userData.profileIconId}`);
        console.log(`Received profileIconURL: ${userData.profileIconURL}`);
        console.log(`Received level: ${userData.summonerLevel}`);
        this.lolStore.setUserData(userData);
      }
    }
  }
});
</script>
<style scoped>
.header-cell,
.content-cell {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #eee;
}
.header-row {  
  font-weight: bold;
}
</style>