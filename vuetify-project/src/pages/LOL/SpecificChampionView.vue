<template>
  <v-app>
    <AppBar :currentCategory="'LOL'"/>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card v-if="champion">
              <v-card-title>{{ champion.name }}</v-card-title>
              <v-card-text>
                <v-img :src="champion.iconURL" aspect-ratio="1" class="champion-image"></v-img>
                <div><strong>Title:</strong> {{ champion.championData.title }}</div>
                <div><strong>Bio:</strong> {{ champion.championData.bio }}</div>
                <v-carousel hide-delimiters height="400px" v-model="currentSkin">
                  <v-carousel-item v-for="(image) in champion.championData.imagesURL" :key="image.id">
                    <v-img :src="image.imageURL" aspect-ratio="1"></v-img>
                  </v-carousel-item>
                </v-carousel>
                <div class="text-center mt-2">
                  <strong>{{ champion.championData.imagesURL[currentSkin]?.name }}</strong>
                </div>
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
import { useRoute } from 'vue-router';
import axios from 'axios';
import AppBar from '@/components/AppBar.vue';
import { Champion } from '@/types/index';

export default defineComponent({
  name: 'SpecificChampionView',
  components: {
    AppBar
  },
  setup() {
    const route = useRoute();
    const championId = route.params.championId as string;
    const champion = ref<Champion | null>(null);
    const currentSkin = ref(0);

    onMounted(async () => {
      try {
        const response = await axios.get(`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championId}.json`);
        const championName = response.data.name.replace(/\s+/g, '').toLowerCase();

        champion.value = {
          id: response.data.id,
          name: response.data.name,
          iconURL: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${response.data.id}.png`,
          championData: {
            title: response.data.title,
            bio: response.data.shortBio,
            imagesURL: response.data.skins.map((skin: any) => {
              const skinFolder = skin.isBase ? 'base' : `skin${String(skin.id % 1000).padStart(2, '0')}`;
              const skinImage = String(skin.id % 1000).padStart(2, '0').replace(/^0+(?!$)/, '');
              return {
                id: skin.id,
                name: skin.name,
                imageURL: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${championName}/skins/${skinFolder}/images/${championName}_splash_uncentered_${skinImage}.jpg`
              };
            })
          }
        };
      } catch (error) {
        console.error('Error fetching champion data:', error);
      }
    });

    return {
      champion,
      currentSkin
    };
  }
});
</script>

<style scoped>
.champion-image {
  max-width: 128px;
  margin-bottom: 16px;
}
.text-center {
  text-align: center;
}
.mt-2 {
  margin-top: 16px;
}
</style>
