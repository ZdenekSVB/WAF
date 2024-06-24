<template>
  <v-app>
    <AppBar :currentCategory="'TFT'" />
    <v-main>
      <v-container>
        <!-- Center the Summoner Info card -->
        <v-row>
          <v-col cols="12">
            <v-card class="text-center">
              <v-card-title>Summoner Info</v-card-title>
              <v-card-text>
                <v-text-field v-model="name" label="Summoner Name" outlined dense></v-text-field>
                <v-text-field v-model="tag" label="Tag" outlined dense></v-text-field>

                <v-btn v-if="!loading" @click="fetchSummonerData" color="primary">Fetch Data</v-btn>
                <div v-if="loading">
                  <v-progress-circular indeterminate size="64"></v-progress-circular>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Dynamically generated cards -->
        <v-row>
          <v-col v-for="(info, index) in editedUserInfos" :key="index" cols="12" md="6">
            <v-card class="text-center">
              <v-card-title>Edited User Info {{ index + 1 }}</v-card-title>
              <v-card-text>
                <div>
                  <div><strong>TagLine:</strong> {{ info.tagLine }}</div>
                  <div><strong>Summoner Name:</strong> {{ info.name }}</div>
                  <div><strong>Summoner Level:</strong> {{ info.summonerLevel }}</div>
                </div>
                <v-btn @click="editUserInfo(index)" color="primary">Edit</v-btn>
                <v-btn @click="deleteUserInfo(index)" color="error">Delete</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import AppBar from '@/components/AppBar.vue';

export default defineComponent({
  name: 'SummonerView',
  components: {
    AppBar
  },
  data() {
    return {
      name: '',
      tag: '',
      loading: false,
      userInfo: {
        name: '',
        summonerLevel: 0,
        tagLine: ''
      },
      editedUserInfos: []
    };
  },
  methods: {
    validateInputs() {
      const validTag = ['EUN1', 'EUW1', 'BR1', 'JP1', 'KR', 'LA1', 'LA2', 'NA1', 'OC1', 'TR1', 'RU', 'PH2', 'SG2', 'TH2', 'TW2', 'VN2'];
      if (!this.name.trim()) {
        alert('Summoner Name cannot be empty');
        return false;
      }
      if (!validTag.includes(this.tag)) {
        alert('Invalid tag. Please enter a valid tag');
        return false;
      }
      return true;
    },
    async fetchSummonerData() {
      if (!this.validateInputs()) return;

      this.loading = true;
      try {
        const response = await axios.get(`http://localhost:3003/api/summoner/${this.name}/${this.tag}`);
        this.userInfo.name = response.data.gameName;
        this.userInfo.summonerLevel = response.data.summonerLevel;
        this.userInfo.tagLine = response.data.tagLine;
        this.saveUserInfo({ ...this.userInfo }); // Save initial fetch as first edited version
      } catch (error) {
        alert('Summoner not found. Please enter a valid summoner name and tag.');
        console.error('Error fetching summoner data:', error);
      } finally {
        this.loading = false;
      }
    },
    editUserInfo(index) {
      this.loading = true;
      try {
        const editedInfo = this.editedUserInfos[index];
        editedInfo.tagLine = prompt('Enter new Tag:', editedInfo.tagLine) || editedInfo.tagLine;
        editedInfo.name = prompt('Enter new Name:', editedInfo.name) || editedInfo.name;
        editedInfo.summonerLevel = prompt('Enter new Level:', editedInfo.summonerLevel) || editedInfo.summonerLevel;
        this.saveUserInfo(editedInfo);
      } catch (error) {
        console.error('Error editing summoner data:', error);
      } finally {
        this.loading = false;
      }
    },
    saveUserInfo(userInfo) {
      this.loading = true;
      try {
        const existingIndex = this.editedUserInfos.findIndex(info => info.name === userInfo.name);
        if (existingIndex !== -1) {
          this.editedUserInfos[existingIndex] = { ...userInfo };
        } else {
          this.editedUserInfos.push({ ...userInfo });
        }
        localStorage.setItem('editedUserInfos', JSON.stringify(this.editedUserInfos));
      } catch (error) {
        console.error('Error saving summoner data:', error);
      } finally {
        this.loading = false;
      }
    },
    deleteUserInfo(index) {
      this.editedUserInfos.splice(index, 1);
      localStorage.setItem('editedUserInfos', JSON.stringify(this.editedUserInfos));
    },
    loadUserInfos() {
      this.loading = true;
      try {
        const savedUserInfos = localStorage.getItem('editedUserInfos');
        if (savedUserInfos) {
          this.editedUserInfos = JSON.parse(savedUserInfos);
        }
      } catch (error) {
        console.error('Error loading summoner data:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.loadUserInfos();
  }
});
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
