<template>
  <main>
    <div class="game dota" @mouseover="expandImage" @mouseout="shrinkImage" @click="navigateTo('dota')">
      <img src="@/assets/dotaBack.jpg" alt="Dota">
    </div>
    <div class="game counter-strike" @mouseover="expandImage" @mouseout="shrinkImage" @click="navigateTo('counter-strike')">
      <img src="@/assets/counter-strike.png" alt="Counter-Strike 2">
    </div>
    <div class="game tft" @mouseover="expandImage" @mouseout="shrinkImage" @click="navigateTo('TFTSearch')">
      <img src="@/assets/tft.png" alt="Teamfight Tactics">
    </div>
    <div class="game league-of-legends" @mouseover="expandImage" @mouseout="shrinkImage" @click="navigateTo('LOLSearch')">
      <img src="@/assets/league-of-legends.png" alt="League of Legends">
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  methods: {
    expandImage(event: MouseEvent) {
      const target = event.currentTarget as HTMLElement;
      target.style.zIndex = '0.5';
      target.style.transform = 'scale(1.05)';
    },
    shrinkImage(event: MouseEvent) {
      const target = event.currentTarget as HTMLElement;
      target.style.zIndex = '0';
      target.style.transform = 'scale(1)';
    },
    navigateTo(route: string) {
      this.$router.push({ name: route });
    }
  }
});
</script>

<style scoped>
main {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  height: 100vh; /* Adjusted height for full viewport */
  padding: 0;
  margin: 0 auto; /* Centering main horizontally */
  background-color: #1e1e1e;
  overflow: hidden;
}

.game {
  flex: 1;
  height: 100%;
  transition: transform 0.3s;
  overflow: hidden;
  margin-left: 0;
  margin-right: -15%;
  padding: -15%;
  position: relative;
}

.game img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s;
  margin: 0;
  padding: 0;
}

.game.dota img {
  clip-path: polygon(0 0, 85% 0, 70% 100%, 0% 100%);
}

.game.counter-strike img {
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
}

.game.tft img {
  clip-path: polygon(15% 0, 85% 0, 70% 100%, 0% 100%);
}

.game.league-of-legends img {
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
}
</style>
