<template>
  <div class="elo-view" data-cy="elo-view">
    <h3>ELO Progress</h3>
    <div class="elo-progress" v-if="elo !== null">
      <div class="elo-header">
        <p data-cy="elo-header">{{ profile.nickname }}'s Elo is {{ elo }} - LVL {{ level }}</p>
        <div class="elo-bar">
          <div class="elo-bar-fill" :style="{ width: progressBarWidth }" data-cy="elo-bar-fill"></div>
        </div>
      </div>
      <div class="levels">
        <div v-for="level in levels" :key="level.number" class="level" data-cy="level">
          <img :src="level.image" alt="Level Image" class="level-image">
          <p>{{ level.range[0] }} - {{ level.range[1] }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p data-cy="loading-elo">Loading ELO data...</p>
    </div>

    <!-- Comparison Input Section -->
    <div class="compare-input">
      <input v-model="comparisonNickname" type="text" placeholder="Enter nickname to compare" />
      <button @click="compareElo">Compare</button>
    </div>
    
    <!-- Comparison Section -->
    <div class="compare-section" v-if="comparisonElo !== null">
      <h3>Comparison with {{ comparisonProfile.nickname }}</h3>
      <p>{{ profile.nickname }}'s Elo: {{ elo }}</p>
      <p>{{ comparisonProfile.nickname }}'s Elo: {{ comparisonElo }}</p>
      <div class="elo-bar">
        <div class="elo-bar-fill" :style="{ width: comparisonProgressBarWidth }" data-cy="comparison-elo-bar-fill"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { getFaceitProfile } from './faceitService';

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
    const comparisonElo = ref<number | null>(null);
    const comparisonProfile = ref<any | null>(null);
    const comparisonNickname = ref<string>('');
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

    const fetchComparisonProfile = async (nickname: string) => {
      try {
        const profile = await getFaceitProfile(nickname);
        comparisonProfile.value = profile;
        comparisonElo.value = profile.games?.cs2?.faceit_elo || 0;
      } catch (error) {
        console.error('Error fetching comparison profile:', error);
      }
    };

    const compareElo = () => {
      if (comparisonNickname.value) {
        fetchComparisonProfile(comparisonNickname.value);
      }
    };

    const level = computed(() => {
      console.log('Calculating level for ELO:', elo.value);
      const currentLevel = levels.value.find(l => elo.value! >= l.range[0] && elo.value! <= l.range[1]);
      return currentLevel ? currentLevel.number : 1;
    });

    const progressBarWidth = computed(() => {
      if (elo.value! >= 2001) {
        return '100%';
      }
      const currentLevelIndex = levels.value.findIndex(l => elo.value! >= l.range[0] && elo.value! <= l.range[1]);
      const currentLevel = levels.value[currentLevelIndex];
      const nextLevel = levels.value[currentLevelIndex + 1];
      const range = nextLevel.range[0] - currentLevel.range[0];
      const progress = ((elo.value! - currentLevel.range[0]) / range) * 10 + (currentLevelIndex * 10);
      return `${progress}%`;
    });

    const comparisonProgressBarWidth = computed(() => {
      if (comparisonElo.value! >= 2001) {
        return '100%';
      }
      const currentLevelIndex = levels.value.findIndex(l => comparisonElo.value! >= l.range[0] && comparisonElo.value! <= l.range[1]);
      const currentLevel = levels.value[currentLevelIndex];
      const nextLevel = levels.value[currentLevelIndex + 1];
      const range = nextLevel.range[0] - currentLevel.range[0];
      const progress = ((comparisonElo.value! - currentLevel.range[0]) / range) * 10 + (currentLevelIndex * 10);
      return `${progress}%`;
    });

    return {
      elo,
      comparisonElo,
      comparisonProfile,
      comparisonNickname,
      levels,
      level,
      progressBarWidth,
      comparisonProgressBarWidth,
      compareElo
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

/* Comparison Input Section */
.compare-input {
  margin-top: 20px;
  text-align: center;
}

.compare-input input {
  padding: 5px;
  margin-right: 10px;
}

.compare-input button {
  padding: 5px 10px;
}

/* Comparison Section */
.compare-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}

.compare-section h3 {
  text-align: center;
}

.compare-section p {
  text-align: center;
  margin: 5px 0;
}

.compare-section .elo-bar {
  margin: 10px auto;
  width: 80%;
}
</style>
