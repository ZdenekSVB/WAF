<template>
    <v-app>
      <AppBar />
      <v-main>
        <v-img
          class="background"
          src="@/assets/tftbackground.png"
          alt="Background"
        />
        <div class="search-field">
          <v-text-field
            v-model="searchQuery"
            label="Search"
            outlined
            class="mx-auto"
            dense
            hide-details
          ></v-text-field>
        </div>
      </v-main>
      <router-view />
    </v-app>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import AppBar from '@/components/AppBar.vue'; // Adjust the path as needed
  
  export default defineComponent({
    name: 'SearchView',
    components: {
      AppBar
    },
    data() {
      return {
        searchQuery: ''
      };
    },
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
  