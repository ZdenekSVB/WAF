<template>
  <v-app>
    <NavBar />
    <v-main>
      <v-container>
        <v-card class="heroes-card" elevation="2">
          <v-card-title>Hero Statistics</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="Search by Name"
              outlined
              dense
              clearable
            ></v-text-field>
            <v-data-table
              :headers="headers"
              :items="filteredHeroes"
              item-key="id"
              class="elevation-1"
            >
              <template v-slot:item.img="{ item }">
                <v-img
                  v-if="item.img"
                  :src="item.img"
                  alt="Hero Image"
                  height="150"
                  width="80"
                ></v-img>
                <span v-else>No Image</span>
              </template>
            </v-data-table>
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
  name: 'HeroStats',
  components: {
    NavBar
  },
  //TODO column names
  data() {
    return {
      heroes: [],
      search: '', // Initialize search string
      headers: [
        { text: 'Image', value: 'img', sortable: false }, // Use 'img' instead of 'icon'
        { text: 'Name', value: 'localized_name' },
        { text: 'Primary Attribute', value: 'primary_attr' },
        { text: 'Attack Type', value: 'attack_type' },
        { text: 'Roles', value: 'roles' },
        { text: 'Base Health', value: 'base_health' },
        { text: 'Base Mana', value: 'base_mana' },
        { text: 'Base Armor', value: 'base_armor' },
        { text: 'Base Attack', value: 'base_attack_min' },
        { text: 'Attack Range', value: 'attack_range' },
        { text: 'Move Speed', value: 'move_speed' },
      ],
    };
  },
  computed: {
    filteredHeroes() {
      // Filter heroes based on search string
      return this.heroes.filter(hero =>
        hero.localized_name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  async created() {
    try {
      const response = await axios.get('https://api.opendota.com/api/heroStats');
      this.heroes = response.data.map(hero => ({
        ...hero,
        // Add full URL prefix to img path
        img: `https://cdn.cloudflare.steamstatic.com${hero.img}`
      }));
    } catch (error) {
      console.error('Error fetching hero data:', error);
    }
  },
});
</script>

<style scoped>
/* Add scoped styles if necessary */
.heroes-card {
  animation: fadeIn 1s ease-in-out;
  margin-top: 20px;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.v-data-table__row {
  transition: background-color 0.3s ease;
}
.v-data-table__row:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
