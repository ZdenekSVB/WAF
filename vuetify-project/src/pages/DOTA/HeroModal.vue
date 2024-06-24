<template>
  <v-dialog :value="modalOpen" max-width="800" @input="$emit('update:modalOpen', $event)">
    <v-card>
      <v-img :src="getHeroImage(heroId)" alt="Hero Image" class="modal-hero-image"></v-img>
      <v-card-title>{{ hero.name }}</v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Base Health</v-list-item-title>
              <v-list-item-subtitle>{{ hero.base_health }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Base Health Regen</v-list-item-title>
              <v-list-item-subtitle>{{ hero.base_health_regen }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <!-- Add other attributes here -->
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="$emit('update:modalOpen', false)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modalOpen: Boolean,
    heroId: Number,
    getHeroImage: Function,
    heroData: Array
  },
  computed: {
    hero() {
      return this.heroData.find(hero => hero.id === this.heroId) || {};
    }
  }
};
</script>

<style scoped>
.modal-hero-image {
  width: 100%;
  height: auto;
}
</style>
