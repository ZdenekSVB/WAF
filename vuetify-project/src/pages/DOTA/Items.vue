<template>
  <v-app>
    <AppBar :currentCategory="'DOTA'"/>
    <v-main>
      <v-container>
        <v-card class="items-card" elevation="2">
          <v-card-title>Item Statistics</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="Search by Name"
              outlined
              dense
              clearable
            ></v-text-field>
            <v-data-table
              :headers="headers"
              :items="filteredItems"
              item-key="dname"
              class="elevation-1"
            >
              <template v-slot:item.img="{ item }">
                <v-img
                  v-if="item.img"
                  :src="item.img"
                  alt="Item Image"
                  height="80"
                  width="40"
                ></v-img>
                <span v-else>No Image</span>
              </template>
              <template v-slot:item.notes="{ item }">
                <span>{{ item.notes }}</span>
              </template>
              <template v-slot:item.attrib="{ item }">
                <v-menu offset-y v-model="item.menuOpen">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" text>{{ attributeSummary(item.attrib) }}</v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="(attr, index) in item.attrib" :key="index">
                      <v-list-item-content>
                        <v-list-item-title>{{ attr.key }}</v-list-item-title>
                        <v-list-item-subtitle>{{ attr.value }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <template v-slot:item.lore="{ item }">
                <span v-if="item.lore">{{ item.lore }}</span>
                <span v-else>No lore available.</span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import AppBar from '@/components/AppBar.vue';

interface Item {
  dname: string;
  cost: number;
  img: string;
  notes: string;
  attrib: { key: string; value: string }[];
  lore: string;
  menuOpen: boolean; // New property to control menu visibility
}

export default defineComponent({
  name: 'ItemStats',
  components: {
    AppBar
  },
  data() {
    return {
      items: [] as Item[],
      search: '',
      headers: [
        { title: 'Image', align: 'center', sortable: false, value: 'img' },
        { title: 'Name', align: 'start', value: 'dname' },
        { title: 'Cost', value: 'cost' },
        { title: 'Notes', sortable: false, value: 'notes' },
        { title: 'Lore', sortable: false, value: 'lore' }
      ],
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter(item =>
        item.dname.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {
    async fetchItems() {
      try {
        const response = await axios.get('https://api.opendota.com/api/constants/items');
        console.log(response.data);
        // Map API response to Item interface properties
        this.items = Object.values(response.data).map((item: any) => ({
          dname: item.dname || 'Unknown Name',
          cost: item.cost || 0,
          img: item.img ? `https://cdn.cloudflare.steamstatic.com${item.img}` : '',
          notes: item.notes || 'No additional notes.',
          lore: item.lore || '',
          menuOpen: false // Initialize menuOpen property
        }));
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    },
  },
  mounted() {
    this.fetchItems();
  }
});
</script>

<style scoped>
.items-card {
  animation: fadeIn 1s ease-in-out;
  margin-top: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.v-data-table__row {
  transition: background-color 0.3s ease;
}

.v-data-table__row:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
