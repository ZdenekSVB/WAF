import { defineStore } from 'pinia';
import { LolAccountData, MatchDetails } from '@/types/index';

export const useLolStore = defineStore('lolStore', {
  state: () => ({
    userData: {} as LolAccountData
  }),
  actions: {
    setUserData(data: LolAccountData) {
      this.userData = data;
      this.userData.profileIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${this.userData.profileIconId}.jpg`;
    },
    addMatchHistory(matches: MatchDetails[]) {
      if (this.userData && this.userData.matchHistory) {
        this.userData.matchHistory = [...this.userData.matchHistory, ...matches];
      }
    }
  },
  getters: {
    getUserData: (state) => state.userData
  }
});
