<template>
  <v-app>
    <AppBar />

    <v-main>
      <div class="search-field">
        <v-text-field
          v-model="searchQuery"
          label="Search"
          outlined
          class="mx-auto"
          dense
          hide-details
          @keyup.enter="searchForPlayer"
        ></v-text-field>
      </div>
    </v-main>

    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SearchView',
  data() {
    return {
      searchQuery: ''
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async searchForPlayer() {
      if (this.searchQuery.trim() === '') {
        alert('Please enter an account ID.');
        return;
      }

      const accountId = this.searchQuery.trim();
      await this.router.push({ name: 'AccountView', params: { accountId } });
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
