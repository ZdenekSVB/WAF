<template>
  <v-app>
    <NavBar />
    <v-main>
      <v-container>
        <v-card class="rankings-card" elevation="2">
          <v-card-title>Player Rankings</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="selectedHeroId"
                    :items="heroIds"
                    label="Select Hero ID"
                    outlined
                    dense
                    clearable
                    @change="fetchRankings"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="search"
                    label="Search by Player Name"
                    outlined
                    dense
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-data-table
                    :headers="headers"
                    :items="filteredRankings"
                    item-key="account_id"
                    class="elevation-1"
                  >
                    <template v-slot:item.avatar="{ item }">
                      <v-img
                        v-if="item.avatarfull"
                        :src="item.avatarfull"
                        alt="Avatar"
                        height="40"
                        width="40"
                      ></v-img>
                      <span v-else>No Avatar</span>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import NavBar from '@/pages/DOTA/NavBar.vue';

export default defineComponent({
  name: 'PlayerRankings',
  components: {
    NavBar
  },
  data() {
    return {
      rankings: [],
      search: '',
      selectedHeroId: null,
      headers: [
        { text: 'Avatar', value: 'avatar', sortable: false },
        { text: 'Player Name', value: 'personaname' },
        { text: 'Steam ID', value: 'steamid' },
        { text: 'Rank Score', value: 'score' },
        { text: 'Profile URL', value: 'profileurl' },
        { text: 'Country Code', value: 'loccountrycode' },
        { text: 'Rank Tier', value: 'rank_tier' }
      ],
      heroIds: [] as number[]
    };
  },
  computed: {
    filteredRankings() {
      return this.rankings.filter(rank =>
        rank.personaname.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  async created() {
    try {
      // Fetch hero IDs and populate selector
      var heroIdList = [];
      for (let i = 1; i <= 100; i++) {
        heroIdList.push(i);
      }
      this.heroIds = heroIdList;

      // Initial fetch of rankings
      if (this.selectedHeroId !== null) {
        await this.fetchRankings();
      }
    } catch (error) {
      console.error('Error fetching hero IDs:', error);
    }
  },
  methods: {
    async fetchRankings() {
      console.log(this.selectedHeroId);
      if (this.selectedHeroId === null) {
        this.rankings = [];
        return;
      }

      try {
        const response = await axios.get(`https://api.opendota.com/api/rankings?hero_id=${this.selectedHeroId}`);
        this.rankings = response.data.rankings;
      } catch (error) {
        console.error('Error fetching player rankings:', error);
      }
    }
  }
});
</script>

<style scoped>
.rankings-card {
  margin-top: 20px;
}
</style>
