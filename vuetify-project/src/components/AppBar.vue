<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-btn v-for="(item, index) in menuItems[currentCategory]" :key="index" @click="changeActiveSite(index)" variant="text">
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
  props: {
    currentCategory: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      drawer: false,
      activeItem: 0,
      menuItems: {
        TFT: ['Team Fight Tactics', 'Stats', 'Buffs/Nerfs', 'Ranking'],
        CS: ['CS'],
        LOL: ['League of Legends','Champions'],
        DOTA: ['DOTA','HEROES', 'MY HEROES','TEAMS','ITEMS']
      },
      menuRoutes: {
        TFT: ['/tft/search', '/tft/stats', '/tft/buffs-nerfs', '/tft/ranking'],
        CS: ['/counter-strike'],
        LOL: ['/lol/search','/lol/champions'],
        DOTA: ['/dota','/heroes','my-heroes','/teams','/items']
      },
      drawerItems: ['Hlavní stránka', 'TFT', 'CSGO', 'LOL', 'Dota']
    };
  },
  methods: {
    navigateTo(index: number) {
      const routes = ['/', '/tft/search', '/counter-strike', '/lol/search', '/dota'];
      this.$router.push(routes[index]);
    },
    changeActiveSite(index: number) {
      this.activeItem = index;
      let routes = [];
      switch (this.currentCategory) {
        case 'TFT':
          routes = this.menuRoutes.TFT;
          break;
        case 'CS':
          routes =this.menuRoutes.CS;
          break;
        case 'LOL':
          routes = this.menuRoutes.LOL;
          break;
        case 'DOTA':
          routes = this.menuRoutes.DOTA;
          break;
        default:
          routes = [];
      }
      this.$router.push(routes[index]);
    }
  },
  mounted() {
    // Set activeItem based on current route on component mount
    const route = useRoute();
    const currentPath = route.path;
    let index = -1;
    switch (this.currentCategory) {
      case 'TFT':
        index = this.menuRoutes.TFT.indexOf(currentPath);
        break;
      case 'CS':
        index = this.menuRoutes.CS.indexOf(currentPath);
        break;
      case 'LOL':
        index = this.menuRoutes.LOL.indexOf(currentPath);
        break;
      case 'DOTA':
        index = this.menuRoutes.DOTA.indexOf(currentPath);
        break;
      default:
        index = -1;
    }
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
