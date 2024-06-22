import { defineStore } from 'pinia';

export const useLolStore = defineStore('lolStore', {
  state: () => ({
    userData: null
  }),
  actions: {
    setUserData(data) {
      this.userData = data;
    }
  },
  getters: {
    getUserData: state => state.userData
  }
});
