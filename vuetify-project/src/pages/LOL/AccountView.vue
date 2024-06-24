<template>
  <v-app>
    <AppBar :currentCategory="'LOL'"/>
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
          <v-col cols="12" md="4" v-for="(stat, index) in filteredStats" :key="index">
            <v-card>
              <v-card-title>{{ getQueueTypeDisplayName(stat.queueType) }} Stats</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-img v-if="stat.tier" :src="rankIcon(stat.tier)" aspect-ratio="1"></v-img>
                  </v-col>
                  <v-col cols="8">
                    <div>
                      <strong>Tier:</strong> {{ stat.tier }} {{ stat.rank }} <br>
                      <strong>League Points:</strong> {{ stat.leaguePoints }} <br>
                      <strong>Wins:</strong> {{ stat.wins }} <br>
                      <strong>Losses:</strong> {{ stat.losses }} <br>
                      <strong>Winrate:</strong> {{ stat.winrate.toFixed(2) }}% <br>
                    </div>
                  </v-col>
                </v-row>
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
                <v-row v-if="!loadingMatches">
                  <v-col cols="12" class="text-center">
                    <v-btn @click="loadMoreMatches" color="primary">Load More Matches</v-btn>
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
import { fetchUserData, fetchMoreMatchHistory } from '@/pages/LOL/lolService';
import AppBar from '@/components/AppBar.vue';

// Import rank icons
import BronzeIcon from '@/assets/lolranks/Rank=Bronze.png';
import SilverIcon from '@/assets/lolranks/Rank=Silver.png';
import GoldIcon from '@/assets/lolranks/Rank=Gold.png';
import IronIcon from '@/assets/lolranks/Rank=Iron.png';
import PlatinumIcon from '@/assets/lolranks/Rank=Platinum.png';
import EmeraldIcon from '@/assets/lolranks/Rank=Emerald.png';
import DiamondIcon from '@/assets/lolranks/Rank=Diamond.png';
import MasterIcon from '@/assets/lolranks/Rank=Master.png';
import GrandmasterIcon from '@/assets/lolranks/Rank=Grandmaster.png';
import ChallengerIcon from '@/assets/lolranks/Rank=Challenger.png';

const rankIcons: Record<string, string> = {
  Bronze: BronzeIcon,
  Silver: SilverIcon,
  Gold: GoldIcon,
  Iron: IronIcon,
  Platinum: PlatinumIcon,
  Emerald: EmeraldIcon,
  Diamond: DiamondIcon,
  Master: MasterIcon,
  Grandmaster: GrandmasterIcon,
  Challenger: ChallengerIcon
};

export default defineComponent({
  name: 'LOLAccountView',
  components: {
    AppBar
  },
  setup() {
    const lolStore = useLolStore();
    const userInfo = computed(() => lolStore.getUserData);

    const searchQuery = ref('');
    const loadingMatches = ref(false);
    const matchStartIndex = ref(20); // This will keep track of the starting index for the next batch of matches

    const searchForPlayer = async () => {
      const [gameName, tagLine] = searchQuery.value.split('#');
      if (!gameName || !tagLine) {
        alert('Please enter the full Riot ID in the format: name#tag');
        return;
      }
      loadingMatches.value = true;
      const userData = await fetchUserData(gameName, tagLine);
      if (userData) {
        lolStore.setUserData(userData);
      }
      loadingMatches.value = false;
    };

    const getQueueTypeDisplayName = (queueType: string) => {
      switch (queueType) {
        case 'RANKED_SOLO_5x5':
          return 'Ranked Solo/Duo';
        case 'RANKED_FLEX_SR':
          return 'Ranked Flex';
        default:
          return queueType;
      }
    };

    const rankIcon = (tier: string) => {
      return rankIcons[tier] || '';
    };

    const filteredStats = computed(() => {
      return userInfo.value.stats.filter(stat => stat.queueType !== 'CHERRY');
    });

    const loadMoreMatches = async () => {
      loadingMatches.value = true;
      const moreMatches = await fetchMoreMatchHistory(userInfo.value.puuid, matchStartIndex.value);
      if (moreMatches.length) {
        lolStore.addMatchHistory(moreMatches);
        matchStartIndex.value += 20; // Increment the start index for the next batch of matches
      }
      loadingMatches.value = false;
    };

    return {
      userInfo,
      searchQuery,
      loadingMatches,
      searchForPlayer,
      getQueueTypeDisplayName,
      rankIcon,
      filteredStats,
      loadMoreMatches
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
