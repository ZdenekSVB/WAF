<template>
  <v-app-bar app>
    <v-toolbar-title>Player Stats</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text :to="{ name: 'MatchesView', params: { accountId } }" v-if="accountId">Matches</v-btn>
    <v-btn text :to="{ name: 'RankingsView', params: { accountId } }" v-if="accountId">Rankings</v-btn>
    <v-btn text :to="{ name: 'HeroesView', params: { accountId } }" v-if="accountId">Heroes</v-btn>
    <v-btn text :to="{ name: 'Teams', params: { accountId } }" v-if="accountId">Teams</v-btn>
    <v-btn text :to="{ name: 'MyHeroes' }">My Heroes</v-btn> <!-- Always visible link -->
  </v-app-bar>
</template>

<script>
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'NavBar',
  setup() {
    const route = useRoute();
    const accountId = route.params.accountId; // Get accountId from route params

    return { accountId };
  }
});
</script>

<style scoped>
.v-app-bar {
  background-color: #10212f;
  color: white;
}

.v-btn {
  color: white;
}
</style>
