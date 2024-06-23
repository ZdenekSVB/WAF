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
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Queue Type</v-card-title>
              <v-card-text>
                <v-select
                  v-model="selectedQueue"
                  :items="queueTypes"
                  label="Select Queue Type"
                  outlined
                  dense
                ></v-select>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card v-for="(stat, index) in filteredStats" :key="index">
              <v-card-title>{{ stat.queueType }} Stats</v-card-title>
              <v-card-text>
                <div><strong>Tier:</strong> {{ stat.tier }} {{ stat.rank }} <br>
                  <strong>League Points:</strong> {{ stat.leaguePoints }} <br>
                  <strong>Wins:</strong> {{ stat.wins }} <br>
                  <strong>Losses:</strong> {{ stat.losses }} <br>
                  <strong>Winrate:</strong> {{ stat.winrate.toFixed(2) }}% <br>
                </div>
                <hr />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Match History</v-card-title>
              <v-card-text>
                <v-row v-if="loadingMatches">
                  <v-col cols="12" class="text-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </v-col>
                </v-row>
                <v-row v-else v-for="(match, index) in userInfo.matchHistory" :key="index">
                  <v-col cols="12">
                    <v-card :class="{'win-background': match.win, 'loss-background': !match.win}">
                      <v-card-title>Match ID: {{ match.matchId }}</v-card-title>
                      <v-card-text>
                        <div><strong>Date:</strong> {{ match.date }} <br>
                          <strong>Champion:</strong> {{ match.champion }} <br>
                          <strong>Role:</strong> {{ match.role }} <br>
                          <strong>K/D/A:</strong> {{ match.kills }} / {{ match.deaths }} / {{ match.assists }} <br>
                          <strong v-if="match.win">Result: Win</strong>
                          <strong v-else>Result: Loss</strong>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
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
import { defineComponent, computed, ref } from 'vue';
import { useLolStore } from '@/stores/lolStore';
import { fetchUserData } from '@/pages/LOL/lolService';
import AppBar from '@/components/AppBar.vue';

export default defineComponent({
  name: 'LOLAccountView',
  components: {
    AppBar
  },
  setup() {
    const lolStore = useLolStore();
    const userInfo = computed(() => lolStore.getUserData);

    const searchQuery = ref('');
    const selectedQueue = ref('All');
    const queueTypes = ['All', 'Ranked Solo', 'Ranked Flex', 'Normal'];
    const loadingMatches = ref(false);

    const filteredStats = computed(() => {
      if (selectedQueue.value === 'All') {
        return userInfo.value.stats.filter(stat => stat.queueType !== 'CHERRY');
      }
      if (selectedQueue.value === 'Normal') {
        return userInfo.value.matchHistory.filter(match => match.queueId !== 420 && match.queueId !== 440);
      }
      return userInfo.value.stats.filter(stat => stat.queueType === selectedQueue.value);
    });

    const searchForPlayer = async () => {
      const [gameName, tagLine] = searchQuery.value.split('#');
      if (!gameName || !tagLine) {
        alert('Please enter the full Riot ID in the format: name#tag');
        return;
      }
      loadingMatches.value = true;
      const userData = await fetchUserData(gameName, tagLine);
      if (userData) {
        console.log(`Received nickname: ${userData.name}`);
        console.log(`Received profileIconID: ${userData.profileIconId}`);
        console.log(`Received profileIconURL: ${userData.profileIconURL}`);
        console.log(`Received level: ${userData.summonerLevel}`);
        lolStore.setUserData(userData);
      }
      loadingMatches.value = false;
    };

    return {
      userInfo,
      searchQuery,
      selectedQueue,
      queueTypes,
      loadingMatches,
      filteredStats,
      searchForPlayer
    };
  }
});
</script>

<style scoped>
.win-background {
  background-color: blue;
  color: black;
}
.loss-background {
  background-color: red;
  color: black;
}
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
