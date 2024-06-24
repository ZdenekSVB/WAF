<template>
  <v-app>
    <NavBar />
    <v-main>
      <v-container>
        <v-card class="favorites-card" elevation="2">
          <v-card-title>My Favorite Heroes</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="favoriteHeroes"
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
              <template v-slot:item.action="{ item }">
                <v-btn @click="removeFromFavorites(item)" color="red">Remove</v-btn>
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
import NavBar from '@/pages/DOTA/NavBar.vue';

export default defineComponent({
  name: 'MyHeroes',
  components: {
    NavBar
  },
  data() {
    return {
      favoriteHeroes: [],
      headers: [
        { title: 'Image', value: 'img', sortable: false },
        { title: 'Name', value: 'localized_name' },
        { title: 'Primary Attribute', value: 'primary_attr' },
        { title: 'Attack Type', value: 'attack_type' },
        { title: 'Roles', value: 'roles' },
        { title: 'Base Health', value: 'base_health' },
        { title: 'Base Mana', value: 'base_mana' },
        { title: 'Base Armor', value: 'base_armor' },
        { title: 'Base Attack', value: 'base_attack_min' },
        { title: 'Attack Range', value: 'attack_range' },
        { title: 'Move Speed', value: 'move_speed' },
        { title: 'Action', value: 'action', sortable: false }
      ]
    };
  },
  methods: {
    loadFavorites() {
      this.favoriteHeroes = JSON.parse(localStorage.getItem('favoriteHeroes') || '[]');
    },
    removeFromFavorites(hero) {
      let favorites = JSON.parse(localStorage.getItem('favoriteHeroes') || '[]');
      favorites = favorites.filter(fav => fav.id !== hero.id);
      localStorage.setItem('favoriteHeroes', JSON.stringify(favorites));
      this.loadFavorites();
      alert(`${hero.localized_name} has been removed from your favorites.`);
    }
  },
  created() {
    this.loadFavorites();
  }
});
</script>

<style scoped>
.favorites-card {
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
