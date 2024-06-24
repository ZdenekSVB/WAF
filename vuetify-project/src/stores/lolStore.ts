import { defineStore } from 'pinia';
import { LolAccountData } from '@/types/index';

export const useLolStore = defineStore('lolStore', {
  state: () => ({
    userData: {} as LolAccountData
  }),
  actions: {
    setUserData(data: LolAccountData) {
      this.userData = data;
      this.userData.profileIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${this.userData.profileIconId}.jpg`;
    },
    addMatchHistory(newMatches) {
      if (this.userData && this.userData.matchHistory) {
        this.userData.matchHistory = [...this.userData.matchHistory, ...newMatches];
      }
    }
  },
  getters: {
    getUserData: (state) => state.userData
  }
});
