export interface LolAccountData {
    summonerId: string;
    name: string;
    summonerLevel: number;
    profileIconId: number;
    profileIconURL: string;
    stats: LolAccountStats[];
  }

  export interface LolAccountStats {
    leagueId?: string;
    queueType: string;
    tier?: string;
    rank?: string;
    leaguePoints?: number;
    wins: number;
    losses: number;
    hotStreak: boolean;
    veteran: boolean;
    freshBlood: boolean;
    inactive: boolean;
    miniSeries?: LolAccountPromo;
    winrate: number;
  }

 export interface LolAccountPromo {
  losses: number;
  progress: string;
  target: number;
  wins: number;
}



  