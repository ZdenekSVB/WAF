import { defineStore } from 'pinia';
import { LolAccountData } from '@/types/index';

export const useLolStore = defineStore('lolStore', {
  state: () => ({
    userData: {} as LolAccountData
  }),
  actions: {
    setUserData(data: LolAccountData) {
      this.userData = data;
    }
  },
  getters: {
    getUserData: (state) => state.userData
  }
});
