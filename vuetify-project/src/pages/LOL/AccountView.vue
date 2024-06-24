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
              <v-card v-for="(stat, index) in filteredStats" :key="index" class="mt-2">
                <v-card-title>{{ getQueueTypeDisplayName(stat.queueType) }} Stats</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="4">
                      <v-img :src="stat.tier ? rankIcon(stat.tier) : ''" aspect-ratio="1"></v-img>
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
              <v-card-title>Match History</v-card-title>
              <v-card-text>
                <v-row v-if="loadingMatches">
                  <v-col cols="12" class="text-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </v-col>
                </v-row>
                <v-row v-else v-for="(match, index) in userInfo.matchHistory" :key="index">
                  <v-col cols="12">
                    <v-card :class="{'win-background': match.win, 'loss-background': !match.win}" @click="toggleExpand(match.matchId)">
                      <v-card-title>Match ID: {{ match.matchId }}</v-card-title>
                      <v-card-text>
                        <div>
                          <strong>Date:</strong> {{ match.date }} <br>
                          <strong>Game Mode:</strong> {{ match.gameMode }} <br>
                          <strong>Duration:</strong> {{ match.duration }} <br>
                          <v-row v-if="expandedMatches[match.matchId]">
                            <v-col cols="6">
                              <v-card class="team-card">
                                <v-card-title>Blue Team</v-card-title>
                                <v-card-text>
                                  <div v-for="participant in match.participants.filter(p => p.teamId === 100)" :key="participant.puuid">
                                    <strong>{{ participant.summonerName }}:</strong> {{ participant.championName }}  <br>
                                    <strong>KDA:</strong> {{ participant.kills }}/{{ participant.deaths }}/{{ participant.assists }}<br>
                                    <strong v-if="participant.role === 'support'">Role:</strong> <span v-if="participant.role === 'support'">{{ participant.role }}</span><span v-else>{{ participant.lane }}</span> <br>
                                    <br>
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-col cols="6">
                              <v-card class="team-card">
                                <v-card-title>Red Team</v-card-title>
                                <v-card-text>
                                  <div v-for="participant in match.participants.filter(p => p.teamId === 200)" :key="participant.puuid">
                                    <strong>{{ participant.summonerName }}:</strong> {{ participant.championName }}  <br>
                                    <strong>KDA:</strong> {{ participant.kills }}/{{ participant.deaths }}/{{ participant.assists }}<br>
                                    <strong v-if="participant.role === 'support'">Role:</strong> <span v-if="participant.role === 'support'">{{ participant.role }}</span><span v-else>{{ participant.lane }}</span> <br>
                                    <br>
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <div class="text-center mt-2">
                  <v-btn @click="loadMoreMatches" color="primary" :disabled="loadingMoreMatches">
                    <span v-if="loadingMoreMatches">
                      <v-progress-circular indeterminate color="white" size="20"></v-progress-circular>
                    </span>
                    <span v-else>Load More Matches</span>
                  </v-btn>
                </div>
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
    const loadingMoreMatches = ref(false);
    const matchStart = ref(0);
    const expandedMatches = ref<{ [key: string]: boolean }>({});

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
        matchStart.value = 20; 
      }
      loadingMatches.value = false;
    };

    const loadMoreMatches = async () => {
      if (!userInfo.value.puuid) return;
      loadingMoreMatches.value = true;
      const moreMatches = await fetchMoreMatchHistory(userInfo.value.puuid, matchStart.value);
      lolStore.addMatchHistory(moreMatches);
      matchStart.value += 20; 
      loadingMoreMatches.value = false;
    };

    const toggleExpand = (matchId: string) => {
      expandedMatches.value[matchId] = !expandedMatches.value[matchId];
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
      return userInfo.value.stats?.filter(stat => stat.queueType !== 'CHERRY');
    });

    return {
      userInfo,
      searchQuery,
      loadingMatches,
      loadingMoreMatches,
      matchStart,
      expandedMatches,
      searchForPlayer,
      loadMoreMatches,
      toggleExpand,
      getQueueTypeDisplayName,
      rankIcon,
      filteredStats
    };
  }
});
</script>

<style scoped>
.win-background {
  background-color: rgb(47, 59, 229);
  color: black;
}
.loss-background {
  background-color: rgb(255, 62, 62);
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
.team-card {
  margin-bottom: 10px;
}
.text-center {
  text-align: center;
}
.mt-2 {
  margin-top: 16px;
}
</style>
