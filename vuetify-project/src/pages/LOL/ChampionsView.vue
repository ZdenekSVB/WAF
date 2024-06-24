<template>
    <v-app>
      <AppBar :currentCategory="'LOL'"/>
      <v-main>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-title>Champions</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="2" v-for="champion in champions" :key="champion.id" @click="goToChampion(champion.id)">
                      <v-card class="align-center">
                        <v-img height="64" :src="champion.iconURL" aspect-ratio="1"></v-img>
                        <v-card-text class=text-center>{{ champion.name }}</v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
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
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import AppBar from '@/components/AppBar.vue';
  import { Champion } from '@/types/index';
  
  export default defineComponent({
    name: 'LolChampionsView',
    components: {
      AppBar
    },
    setup() {
      const champions = ref<Champion[]>([]);
      const router = useRouter();
  
      onMounted(async () => {
        try {
          const response = await axios.get('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json');
          const data = response.data;
          champions.value = data
            .filter((champion: any) => champion.name !== 'None')
            .map((champion: any) => ({
              id: champion.id,
              name: champion.name,
              iconURL: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champion.id}.png`
            }))
            .sort((a: Champion, b: Champion) => a.name.localeCompare(b.name));
        } catch (error) {
          console.error('Error fetching champions data:', error);
        }
      });
  
      const goToChampion = (championId: number) => {
        router.push({ name: 'LOLSpecificChampion', params: { championId: championId } });
      };
  
      return {
        champions,
        goToChampion
      };
    }
  });
  </script>
  
  <style scoped>
  .d-flex {
    display: flex;
  }
  .align-center {
    align-items: center;
  }
  </style>
  