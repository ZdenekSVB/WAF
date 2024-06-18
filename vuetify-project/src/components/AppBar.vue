<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-btn v-for="(item, index) in menuItems" :key="index" @click="changeActiveSite(index)" variant="text">
      <span :class="{'active': activeItem === index}">{{ item }}</span>
    </v-btn>
  </v-app-bar>

    
  <v-navigation-drawer v-model="drawer" app>
  <v-list>
    <v-list-item v-for="(item, index) in drawerItems" :key="index" @click="navigateTo(index)">
      <v-list-item-title>{{ item }}</v-list-item-title>
    </v-list-item>
  </v-list>
</v-navigation-drawer>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'AppBar',
  data() {
    return {
      drawer: false,
      activeItem: 0,
      menuItems: ['Team Fight Tactics', 'Stats', 'Buffs/Nerfs', 'Ranking'],      
      drawerItems: ['Hlavní stránka', 'TFT', 'CSGO', 'LOL', 'Valorant'],
      searchQuery: ''
    };
  },
  methods: {
    navigateTo(index: number) {
      const routes = ['/', '/tft/search', '/counter-strike', '/league-of-legends', '/valorant'];
      this.$router.push(routes[index]);
    },
    changeActiveSite(index: number) {
      this.activeItem = index;
      const routes = ['/tft/search', '/tft/stats', '/tft/buffs-nerfs', '/tft/ranking'];
      this.$router.push(routes[index]);
    }
  },
  mounted() {
    // Set activeItem based on current route on component mount
    const route = useRoute();
    const currentPath = route.path;
    const index = ['/tft/search', '/tft/stats', '/tft/buffs-nerfs', '/tft/ranking'].indexOf(currentPath);
    if (index !== -1) {
      this.activeItem = index;
    }
  }
});
</script>


<style scoped>
.active {
  text-decoration: underline;
}
</style>
