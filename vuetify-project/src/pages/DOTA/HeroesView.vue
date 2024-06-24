<template>
  <v-app>
    <AppBar :currentCategory="'DOTA'"/>
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
              @click:clear="clearSearch"
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
              <template v-slot:item.roles="{ item }">
                <span>{{ formatRoles(item.roles) }}</span>
              </template>
              <template v-slot:item.action="{ item }">
                <v-btn @click="addToFavorites(item)" color="primary">Add to Favorites</v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useFavoriteHeroesStore } from '@/stores/favoriteHeroesStore';
import axios from 'axios';
import AppBar from '@/components/AppBar.vue';

export default defineComponent({
  name: 'HeroStats',
  components: {
    AppBar,
  },
  data() {
    return {
      heroes: [],
      search: '', // Initialize search string
      headers: [
        { title: 'Image', value: 'img', sortable: false },
        { title: 'Name', value: 'localized_name' },
        { title: 'Primary Attribute', value: 'primary_attr' },
        { title: 'Attack Type', value: 'attack_type' },
        { title: 'Roles', value: 'roles', sortable: false }, // Updated to handle roles
        { title: 'Base Health', value: 'base_health' },
        { title: 'Base Mana', value: 'base_mana' },
        { title: 'Base Armor', value: 'base_armor' },
        { title: 'Base Attack', value: 'base_attack_min' },
        { title: 'Attack Range', value: 'attack_range' },
        { title: 'Move Speed', value: 'move_speed' },
        { title: 'Action', value: 'action', sortable: false },
      ],
    };
  },
  computed: {
    filteredHeroes() {
      // Filter heroes based on search string
      return this.heroes.filter((hero) =>
        hero.localized_name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    addToFavorites(hero) {
      const favoriteHeroesStore = useFavoriteHeroesStore();
      favoriteHeroesStore.addToFavorites(hero);
    },
    clearSearch() {
      // Clear the search text when clear icon is clicked
      this.search = '';
    },
    formatRoles(roles) {
      // Format roles as a comma-separated list
      return roles.join(', ');
    },
  },
  async created() {
    try {
      const response = await axios.get('https://api.opendota.com/api/heroStats');
      this.heroes = response.data.map((hero) => ({
        ...hero,
        img: `https://cdn.cloudflare.steamstatic.com${hero.img}`,
      }));
    } catch (error) {
      console.error('Error fetching hero data:', error);
    }
  },
});
</script>


<style scoped>
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
