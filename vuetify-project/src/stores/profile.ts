// stores/profile.ts
import { defineStore } from 'pinia';
import { getFaceitProfile, getFaceitStats, getFaceitMatchHistory } from '@/pages/CS/faceitService';

interface ProfileState {
  nickname: string;
  profile: Profile | null;
  matchHistory: Match[];
  errorMessage: string;
  isLoading: boolean;
  view: string;
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    nickname: '',
    profile: null,
    matchHistory: [],
    errorMessage: '',
    isLoading: false,
    view: 'stats',
  }),
  actions: {
    async searchProfile(nickname: string) {
      this.errorMessage = '';
      this.isLoading = true;
      try {
        this.nickname = nickname;
        this.profile = await getFaceitProfile(nickname);
        if (this.profile) {
          const stats = await getFaceitStats(this.profile.player_id);
          this.profile = { ...this.profile, ...stats };
          this.view = 'stats'; 
        }
      } catch (error) {
        console.error('Error fetching profile or stats:', error);
        this.errorMessage = 'Player not found. Please check the nickname and try again.';
      } finally {
        this.isLoading = false;
      }
    },
    async showMatchHistory(playerId: string) {
      this.isLoading = true;
      try {
        const matchHistory = await getFaceitMatchHistory(playerId);
        this.matchHistory = matchHistory;
      } catch (error) {
        console.error('Error fetching match history:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
