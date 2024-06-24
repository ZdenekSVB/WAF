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

                <!-- Passive and Spells Section -->
                <div class="spells">
                  <!-- Passive Ability -->
                  <div @click="showSpellDescription(champion.passive)">
                    <img :src="getAbilityIconPath('p')" :alt="champion.passive.name" class="spell-icon" />
                  </div>
                  <!-- Spells -->
                  <div v-for="spell in champion.spells" :key="spell.spellKey" @click="showSpellDescription(spell)">
                    <img :src="getAbilityIconPath(spell.spellKey)" :alt="spell.name" class="spell-icon" />
                  </div>
                </div>
                <div v-if="selectedAbility" class="spell-description">
                  <h3>{{ selectedAbility.name }}</h3>
                  <p>{{ selectedAbility.description }}</p>
                </div>

                <!-- Skin Slideshow Section -->
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
import { Champion, ChampionSpell, ChampionPassive } from '@/types/index';

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
    const selectedAbility = ref<ChampionSpell | ChampionPassive | null>(null);

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
          },
          passive: {
            name: response.data.passive.name,
            description: response.data.passive.description,
            abilityIconPath: response.data.passive.abilityIconPath
          },
          spells: response.data.spells.map((spell: any) => ({
            spellKey: spell.spellKey,
            name: spell.name,
            description: spell.description,
            abilityIconPath: spell.abilityIconPath
          }))
        };
      } catch (error) {
        console.error('Error fetching champion data:', error);
      }
    });

    const getAbilityIconPath = (key: string) => {
      const championName = champion.value?.name.replace(/\s+/g, '').toLowerCase() || '';
      return key === 'p'
        ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${championName}/hud/icons2d/${championName}_p.png`
        : `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${championName}/hud/icons2d/${championName}_${key}.png`;
    };

    const showSpellDescription = (ability: ChampionSpell | ChampionPassive) => {
      selectedAbility.value = ability;
    };

    return {
      champion,
      currentSkin,
      selectedAbility,
      getAbilityIconPath,
      showSpellDescription
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
.spells {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.spell-icon {
  width: 64px;
  height: 64px;
  cursor: pointer;
  margin: 0 10px;
}
.spell-description {
  margin-bottom: 20px;
}
</style>
