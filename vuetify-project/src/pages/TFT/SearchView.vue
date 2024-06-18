<template>
  <v-app>
<AppBar/>

<v-main>
  <v-img
        class="background"
        src="@/assets/tftbackground.png"
        alt="Background"
      />
</v-main>

    <router-view />
      </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SearchView',
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
  }
});
</script>

<style scoped>
.active {
  text-decoration: underline;
}
.main-content {
  position: relative;
  width: 100%;
  height: 100vh;
}
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
  margin-top: 20%;
}
</style>
