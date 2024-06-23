<template>
    <div class="elo-view">
      <h3>ELO Progress</h3>
      <div class="elo-progress" v-if="elo !== null">
        <div class="elo-header">
          <p>{{ profile.nickname }}'s Elo is {{ elo }} - LVL {{ level }}</p>
          <div class="elo-bar">
            <div class="elo-bar-fill" :style="{ width: progressBarWidth }"></div>
          </div>
        </div>
        <div class="levels">
          <div v-for="level in levels" :key="level.number" class="level">
            <img :src="level.image" alt="Level Image" class="level-image">
            <p>{{ level.range[0] }} - {{ level.range[1] }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Loading ELO data...</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  
  export default defineComponent({
    name: 'EloView',
    props: {
      profile: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const elo = ref<number | null>(null);
      const levels = ref([
        { number: 1, range: [100, 500], image: '/src/assets/lvl/1.png' },
        { number: 2, range: [501, 750], image: '/src/assets/lvl/2.png' },
        { number: 3, range: [751, 900], image: '/src/assets/lvl/3.png' },
        { number: 4, range: [901, 1050], image: '/src/assets/lvl/4.png' },
        { number: 5, range: [1051, 1200], image: '/src/assets/lvl/5.png' },
        { number: 6, range: [1201, 1350], image: '/src/assets/lvl/6.png' },
        { number: 7, range: [1351, 1530], image: '/src/assets/lvl/7.png' },
        { number: 8, range: [1531, 1750], image: '/src/assets/lvl/8.png' },
        { number: 9, range: [1751, 2000], image: '/src/assets/lvl/9.png' },
        { number: 10, range: [2001, Infinity], image: '/src/assets/lvl/10.png' },
      ]);
  
      onMounted(() => {
        console.log('Profile in EloView:', props.profile);
        elo.value = props.profile.games?.cs2?.faceit_elo || 0;
        console.log('ELO in EloView:', elo.value);
      });
  
      const level = computed(() => {
        console.log('Calculating level for ELO:', elo.value);
        const currentLevel = levels.value.find(l => elo.value! >= l.range[0] && elo.value! <= l.range[1]);
        return currentLevel ? currentLevel.number : 1;
      });
  
      const progressBarWidth = computed(() => {
        if (elo.value! >= 2001) {
          return '100%';
        }
        const currentLevel = levels.value[level.value - 1];
        const previousLevel = levels.value[level.value - 2] || { range: [0, 0] };
        const range = currentLevel.range[1] - previousLevel.range[1];
        const progress = (elo.value! - previousLevel.range[1]) / range * 100;
        console.log('Progress bar calculation:');
        console.log('Current level:', currentLevel);
        console.log('Previous level:', previousLevel);
        console.log('Range:', range);
        console.log('Progress:', progress);
        return `${progress}%`;
      });
  
      return {
        elo,
        levels,
        level,
        progressBarWidth,
      };
    }
  });
  </script>
  
  <style scoped>
  .elo-view {
    margin-top: 20px;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    color: white;
  }
  
  .elo-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .elo-bar {
    background: #333;
    border-radius: 5px;
    overflow: hidden;
    height: 20px;
    margin-top: 10px;
  }
  
  .elo-bar-fill {
    background: #00bfff;
    height: 100%;
    transition: width 0.3s;
  }
  
  .levels {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .level {
    text-align: center;
  }
  
  .level-image {
    width: 50px;
    height: 50px;
  }
  </style>
  