<template>
  <v-app>
    <AppBar :currentCategory="'DOTA'"/>
    <v-main>
      <v-container>
        <!-- Loading Screen -->
        <LoadingScreen v-if="loading" />

        <!-- Search Bar Section -->
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="searchQuery"
              label="Search Player"
              @keyup.enter="searchPlayer"
              dense
              outlined
              clearable
              placeholder="Enter Steam ID or Personaname"
            ></v-text-field>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-width="200"
            >
              <template v-slot:activator="{ on, attrs }">
              </template>
              <v-card>
                <v-list>
                  <v-list-item-group v-if="searchResults.length">
                    <v-list-item
                      v-for="result in searchResults.slice(0, 5)"
                      :key="result.account_id"
                      @click="goToAccount(result.account_id)"
                    >
                      <v-list-item-avatar>
                        <v-img :src="result.avatarfull" alt="Avatar"></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ result.personaname }}</v-list-item-title>
                        <v-list-item-subtitle>{{ result.account_id }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item v-else>
                    <v-list-item-content>
                      <v-list-item-title>No results</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>

        <!-- Player Profile and Stats Section -->
        <v-row v-if="profile">
          <v-col cols="12" md="4">
            <v-card class="profile-card" elevation="2">
              <v-img :src="profile.avatarfull" alt="Profile Image" class="profile-image"></v-img>
              <v-card-title>{{ profile.personaname }}</v-card-title>
              <v-card-subtitle>{{ profile.profileurl }}</v-card-subtitle>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Steam ID</v-list-item-title>
                    <v-list-item-subtitle>{{ profile.steamid }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Plus Member</v-list-item-title>
                    <v-list-item-subtitle>{{ profile.plus }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Country Code</v-list-item-title>
                    <v-list-item-subtitle>{{ profile.loccountrycode }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
            <v-card class="peers-card" elevation="2" v-if="peers.length">
              <v-card-title>Top Peers</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="peersHeaders"
                  :items="peers"
                  class="elevation-1"
                >
                  <template v-slot:item.avatarfull="{ item }">
                    <v-img :src="item.avatarfull" alt="Peer Profile Pic" class="peer-avatar"></v-img>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="8">
            <v-card class="stats-card" elevation="2">
              <v-card-title>Player Statistics</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="stats"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-card>
            <v-card class="matches-card" elevation="2" v-if="matches.length">
              <v-card-title>Recent Matches</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="matchesHeaders"
                  :items="matches"
                  class="elevation-1"
                  @click:row="goToMatchDetail"
                >
                  <template v-slot:item.hero_id="{ item }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-img
                          v-bind="attrs"
                          v-on="on"
                          :src="getHeroImage(item.hero_id)"
                          alt="Hero Image"
                          class="hero-avatar"
                        ></v-img>
                      </template>
                      <v-card>
                        <v-img
                          :src="getHeroImage(item.hero_id)"
                          alt="Hero Image"
                          class="tooltip-hero-image"
                        ></v-img>
                        <v-list dense>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Health</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_health') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Health Regen</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_health_regen') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Mana</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_mana') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Mana Regen</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_mana_regen') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Armor</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_armor') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Magic Resist</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_mr') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Attack Min</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_attack_min') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Attack Max</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_attack_max') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Strength</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_str') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Agility</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_agi') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Intelligence</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_int') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
            <v-card class="heroes-card" elevation="2" v-if="heroes.length">
              <v-card-title>Heroes</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="heroesHeaders"
                  :items="heroes"
                  class="elevation-1"
                >
                  <template v-slot:item.hero_id="{ item }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-img
                          v-bind="attrs"
                          v-on="on"
                          :src="getHeroImage(item.hero_id)"
                          alt="Hero Image"
                          class="hero-avatar"
                        ></v-img>
                      </template>
                      <v-card>
                        <v-img
                          :src="getHeroImage(item.hero_id)"
                          alt="Hero Image"
                          class="tooltip-hero-image"
                        ></v-img>
                        <v-list dense>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Health</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_health') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Health Regen</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_health_regen') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Mana</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_mana') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Mana Regen</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_mana_regen') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Armor</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_armor') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Magic Resist</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_mr') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Attack Min</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_attack_min') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Attack Max</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_attack_max') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Strength</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_str') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Agility</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_agi') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>Base Intelligence</v-list-item-title>
                              <v-list-item-subtitle>{{ getHeroAttribute(item.hero_id, 'base_int') }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import AppBar from '@/components/AppBar.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import NavBar from "@/pages/DOTA/NavBar.vue";

export default defineComponent({
  name: 'AccountView',
  components: {
    NavBar,
    AppBar,
    LoadingScreen,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const accountId = ref(route.params.accountId);

    const searchQuery = ref('');
    const searchResults = ref([]);
    const menu = ref(false);
    const loading = ref(true);

    const profile = ref(null);
    const stats = ref([]);
    const matches = ref([]);
    const heroes = ref([]);
    const peers = ref([]);
    const heroData = ref([]);

    const headers = [
      { text: 'Statistic', align: 'start', sortable: false, value: 'stat' },
      { text: 'Value', value: 'value' },
    ];

    const matchesHeaders = [
      { title: 'Hero', value: 'hero_id' },
      { title: 'Kills', value: 'kills' },
      { title: 'Deaths', value: 'deaths' },
      { title: 'Assists', value: 'assists' },
      { title: 'Duration', value: 'duration' },
      { title: 'Result', value: 'result' },
    ];

    const heroesHeaders = [
      { title: 'Hero', value: 'hero_id' },
      { title: 'Games Played', value: 'games' },
      { title: 'Wins', value: 'win' },
      { title: 'Win Rate', value: 'win_rate' },
    ];

    const peersHeaders = [
      { title: 'Peer Name', value: 'personaname' },
      { title: 'Games Played', value: 'games' },
      { title: 'Win Rate', value: 'win_rate' },
      { title: 'Profile Pic', value: 'avatarfull' }
    ];

    const searchPlayer = async () => {
      try {
        const response = await axios.get(`https://api.opendota.com/api/search?q=${searchQuery.value}`);
        searchResults.value = response.data;
        menu.value = true;
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    const goToAccount = (accountId) => {
      router.push({ name: 'AccountView', params: { accountId } }).then(() => {
        location.reload();
      });
      menu.value = false;
    };

    const fetchHeroData = async () => {
      try {
        const response = await axios.get('https://api.opendota.com/api/heroStats');
        heroData.value = response.data;
      } catch (error) {
        console.error('Error fetching hero data:', error);
      }
    };

    const fetchPlayerData = async (accountId) => {
      loading.value = true;
      try {
        const API_URL = "https://api.opendota.com/api/players";
        const [playerRes, wlRes, matchesRes, heroesRes, peersRes] = await Promise.all([
          axios.get(`${API_URL}/${accountId}`),
          axios.get(`${API_URL}/${accountId}/wl`),
          axios.get(`${API_URL}/${accountId}/matches`),
          axios.get(`${API_URL}/${accountId}/heroes`),
          axios.get(`${API_URL}/${accountId}/peers?limit=10`)
        ]);

        const playerData = playerRes.data;
        const wlData = wlRes.data;
        const matchesData = matchesRes.data;
        const heroesData = heroesRes.data;
        const peersData = peersRes.data;

        profile.value = playerData.profile;
        stats.value = [
          { stat: 'Name', value: playerData.profile?.name },
          { stat: 'Competitive Rank', value: playerData.competitive_rank },
          { stat: 'Solo Competitive Rank', value: playerData.solo_competitive_rank },
          { stat: 'Rank Tier', value: playerData.rank_tier },
          { stat: 'Leaderboard Rank', value: playerData.leaderboard_rank },
          { stat: 'Wins', value: wlData.win },
          { stat: 'Losses', value: wlData.lose },
        ];
        matches.value = matchesData.map(match => ({
          ...match,
          result: match.radiant_win ? 'Win' : 'Lose'
        }));
        heroes.value = heroesData.map(hero => ({
          ...hero,
          win_rate: hero.games ? ((hero.win / hero.games) * 100).toFixed(2) + '%' : '0%'
        }));
        peers.value = peersData.map(peer => ({
          ...peer,
          win_rate: peer.games ? ((peer.with_win / peer.with_games) * 100).toFixed(2) + '%' : '0%'
        }));
      } catch (error) {
        console.error('Error fetching player data:', error);
      } finally {
        loading.value = false;
      }
    };

    const getHeroImage = (heroId) => {
      const hero = heroData.value.find(hero => hero.id === heroId);
      return hero ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.name.replace('npc_dota_hero_', '')}.png` : '';
    };

    const getHeroAttribute = (heroId, attribute) => {
      const hero = heroData.value.find(hero => hero.id === heroId);
      return hero ? hero[attribute] : '';
    };

    onMounted(() => {
      fetchHeroData();
      fetchPlayerData(accountId.value);
    });

    return {
      accountId,
      searchQuery,
      searchResults,
      menu,
      profile,
      stats,
      matches,
      heroes,
      peers,
      headers,
      matchesHeaders,
      heroesHeaders,
      peersHeaders,
      searchPlayer,
      goToAccount,
      loading,
      heroData,
      getHeroImage,
      getHeroAttribute
    };
  },
});
</script>

<style scoped>
.profile-card {
  margin-bottom: 20px;
}

.profile-image {
  width: 100%;
  height: auto;
}

.peers-card,
.stats-card,
.matches-card,
.heroes-card {
  margin-bottom: 20px;
}

.hero-avatar,
.peer-avatar {
  width: 50px;
  height: 50px;
}

.tooltip-hero-image {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}
</style>
