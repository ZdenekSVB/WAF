import { defineStore } from 'pinia';
import { LolAccountData } from '@/types/index';

export const useLolStore = defineStore('lolStore', {
  state: () => ({
    userData: {} as LolAccountData
  }),
  actions: {
    setUserData(data: LolAccountData) {
      console.log(`Received store nickname: ${this.userData.name}`);
      console.log(`Received store iconId: ${this.userData.profileIconId}`);
      console.log(`Received store iconUrl: ${this.userData.profileIconURL}`);
      console.log(`Received store level: ${this.userData.summonerLevel}`);
      this.userData = data;
      this.userData.profileIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${this.userData.profileIconId}.jpg`;
      
    }
  },
  getters: {
    getUserData: (state) => state.userData
  }
});
