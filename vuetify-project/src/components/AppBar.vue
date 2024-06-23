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
        LOL: ['LOL'],
        DOTA: ['DOTA']
      },
      drawerItems: ['Hlavní stránka', 'TFT', 'CSGO', 'LOL', 'Valorant']
    };
  },
  methods: {
    navigateTo(index: number) {
      const routes = ['/', '/tft/search', '/counter-strike', '/lol/search', '/valorant'];
      this.$router.push(routes[index]);
    },
    changeActiveSite(index: number) {
      this.activeItem = index;
      let routes = [];
      switch (this.currentCategory) {
        case 'TFT':
          routes = ['/tft/search', '/tft/stats', '/tft/buffs-nerfs', '/tft/ranking'];
          break;
        case 'CS':
          routes = ['/account-view/:accountId', '/counter-strike'];
          break;
        case 'LOL':
          routes = ['/lol/search', '/lol/account'];
          break;
        case 'DOTA':
          routes = ['/valorant'];
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
        index = ['/tft/search', '/tft/stats', '/tft/buffs-nerfs', '/tft/ranking'].indexOf(currentPath);
        break;
      case 'CS':
        index = ['/account-view/:accountId', '/counter-strike'].indexOf(currentPath);
        break;
      case 'LOL':
        index = ['/lol/search', '/lol/account'].indexOf(currentPath);
        break;
      case 'DOTA':
        index = ['/valorant'].indexOf(currentPath);
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
