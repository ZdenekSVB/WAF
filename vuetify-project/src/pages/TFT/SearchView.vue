<template>
  <v-app>
    <AppBar />
    <div class="background"></div>
    <div class="search-field">
      <v-text-field
        v-model="searchQuery"
        label="Search"
        outlined
        dense
        hide-details
        @keyup.enter="goToStatsPage"
      ></v-text-field>
      <v-btn @click="goToStatsPage">Search</v-btn>
    </div>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import AppBar from '@/components/AppBar.vue';

export default defineComponent({
  name: 'TFTSearchView',
  components: {
    AppBar
  },
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    goToStatsPage() {
      if (this.searchQuery.trim() === '') {
        alert('Please enter a search query');
        return;
      }
      this.$router.push({ name: 'TFTStats', query: { search: this.searchQuery } });
    }
  }
});
</script>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
}

.search-field {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 80%;
  max-width: 400px;
}
</style>
