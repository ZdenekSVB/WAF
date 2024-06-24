export interface LolAccountData {
    puuid: string;
    name: string;
    summonerLevel: number;
    profileIconId: number;
    profileIconURL: string;
    matchHistory?: MatchDetails[];
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

export interface MatchDetails {
  matchId: string;
  date: string;
  duration: string;
  gameMode: string;
  participants: ParticipantDto[];
  win: boolean;
}

export interface ParticipantDto {
  summonerName: string;
  championId: number;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  role: string;
  lane: string;
  teamId: number;
  win: boolean;
  puuid: string;
}

export interface Champion {
  id: number;
  name: string;
  iconURL: string;
  championData: ChampionData;
  spells: ChampionSpell[];
  passive: ChampionPassive;
}

export interface ChampionData {
  title: string;
  bio: string;
  imagesURL: ChampionImages[];
}

export interface ChampionImages {
  id: string;
  name: string;
  imageURL: string;
}

export interface ChampionSpell { 
  spellKey: string;
  name: string;
  description: string;
  abilityIconPath: string;
}

export interface ChampionPassive { 
  name: string;
  description: string;
  abilityIconPath: string;
}