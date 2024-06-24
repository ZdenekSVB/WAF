<template>
  <div class="match-history" data-cy="match-history">
    <h3>Match history</h3>
    <v-row>
      <v-col>
        <v-select
          v-model="filterCriteria"
          :items="filterOptions"
          label="Filter by"
          outlined
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          v-model="sortCriteria"
          :items="sortOptions"
          label="Sort by"
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <div v-for="match in filteredAndSortedMatches" :key="match.match_id" class="match-card" @click="openMatchDetails(match)" data-cy="match-card">
      <div class="map-container" data-cy="map-container">
        <img :src="`/src/assets/maps/${match.map}.png`" alt="Map Image" class="map-image" data-cy="map-image">
        <p data-cy="map-name">{{ match.map }}</p>
      </div>
      <div class="match-details" data-cy="match-details">
        <p class="result" :class="{'win': match.results === 'Win', 'loss': match.results === 'Loss'}" data-cy="match-result">{{ match.results }}</p>
        <p data-cy="match-kad">K-A-D: {{ match.kills }}-{{ match.assists }}-{{ match.deaths }}</p>
        <p data-cy="match-rating">Rating: {{ match.rating }}</p>
        <p data-cy="match-date">Date: {{ match.date }}</p>
      </div>
    </div>
    <v-dialog v-model="isDialogOpen" max-width="600px">
      <v-card>
        <v-card-title>Match Details</v-card-title>
        <v-card-text>
          <p>Map: {{ selectedMatch.map }}</p>
          <p>Result: {{ selectedMatch.results }}</p>
          <p>Kills: {{ selectedMatch.kills }}</p>
          <p>Assists: {{ selectedMatch.assists }}</p>
          <p>Deaths: {{ selectedMatch.deaths }}</p>
          <p>Rating: {{ selectedMatch.rating }}</p>
          <p>Date: {{ selectedMatch.date }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="isDialogOpen = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue';

export default defineComponent({
  name: 'MatchHistoryView',
  props: {
    profile: {
      type: Object as PropType<Profile>,
      required: true
    },
    matchHistory: {
      type: Array as PropType<Match[]>,
      required: true
    }
  },
  setup(props) {
    const filterCriteria = ref('');
    const sortCriteria = ref('');
    const isDialogOpen = ref(false);
    const selectedMatch = ref<Match | null>(null);

    const filterOptions = ['All', 'Win', 'Loss'];
    const sortOptions = ['Date', 'Kills', 'Rating'];

    const filteredAndSortedMatches = computed(() => {
      let matches = props.matchHistory;

      if (filterCriteria.value) {
        matches = matches.filter(match => {
          if (filterCriteria.value === 'Win') return match.results === 'Win';
          if (filterCriteria.value === 'Loss') return match.results === 'Loss';
          return true;
        });
      }

      if (sortCriteria.value) {
        matches = matches.sort((a, b) => {
          if (sortCriteria.value === 'Date') return new Date(b.date) - new Date(a.date);
          if (sortCriteria.value === 'Kills') return b.kills - a.kills;
          if (sortCriteria.value === 'Rating') return b.rating - a.rating;
          return 0;
        });
      }

      return matches;
    });

    const openMatchDetails = (match: Match) => {
      selectedMatch.value = match;
      isDialogOpen.value = true;
    };

    return {
      filterCriteria,
      sortCriteria,
      filterOptions,
      sortOptions,
      filteredAndSortedMatches,
      isDialogOpen,
      selectedMatch,
      openMatchDetails
    };
  }
});
</script>

<style scoped>
.match-history {
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
}

.match-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1f1f1f;
  color: white;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid #444;
  cursor: pointer; /* Přidání ukazatele kurzoru */
}

.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map-image {
  width: 100px;
  height: 60px;
  border-radius: 5px;
}

.match-details {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  padding-left: 20px;
}

.match-details p {
  margin: 0;
  padding: 0 10px;
}

.result {
  font-size: 18px;
  font-weight: bold;
  flex-basis: 80px;
  text-align: center;
}

.kda {
  flex-basis: 150px;
  text-align: center;
}

.rating {
  flex-basis: 100px;
  text-align: center;
}

.date {
  flex-basis: 150px;
  text-align: center;
}

.win {
  color: green;
}

.loss {
  color: red;
}

@media (max-width: 768px) {
  .match-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .match-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding-left:0;
  }

  .match-details p {
    text-align: center;
    padding: 2em;
  }
}
</style>
