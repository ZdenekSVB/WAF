<template>
  <v-app>
    <AppBar />

    <v-main>
      <v-container>
        <v-card>
          <v-card-title>Buff/Nerf Table</v-card-title>
          <v-card-text>
            <!-- Buff Section -->
            <v-row class="header-row">
              <v-col cols="6">
                <div class="header-cell">
                  Buff
                </div>
              </v-col>
              <v-col cols="6">
                <div class="header-cell">
                  Patch Number
                </div>
              </v-col>
            </v-row>
            <v-row v-for="(row, rowIndex) in buffData" :key="`buff-${rowIndex}`">
              <v-col cols="6">
                <div class="content-cell">
                  {{ row.buff }}
                </div>
              </v-col>
              <v-col cols="6">
                <div class="content-cell">
                  {{ row.patch }}
                </div>
              </v-col>
            </v-row>

            <!-- Nerf Section -->
            <v-row class="header-row">
              <v-col cols="6">
                <div class="header-cell">
                  Nerf
                </div>
              </v-col>
              <v-col cols="6">
                <div class="header-cell">
                  Patch Number
                </div>
              </v-col>
            </v-row>
            <v-row v-for="(row, rowIndex) in nerfData" :key="`nerf-${rowIndex}`">
              <v-col cols="6">
                <div class="content-cell">
                  {{ row.nerf }}
                </div>
              </v-col>
              <v-col cols="6">
                <div class="content-cell">
                  {{ row.patch }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BuffNerfView',
  data() {
    return {
      buffData: [
        { buff: 'Buff 1', patch: 'Patch 1' },
        // Add more rows as needed
      ],
      nerfData: [
        { nerf: 'Nerf 1', patch: 'Patch 1' },
        // Add more rows as needed
      ],
    };
  },
});
</script>

<style scoped>
.header-cell,
.content-cell {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.header-row {
  font-weight: bold;
}

</style>
