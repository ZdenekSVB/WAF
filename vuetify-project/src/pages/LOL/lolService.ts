import axios from 'axios';
import { LolAccountData, LolAccountStats } from '@/types/index';

export const fetchUserData = async (gameName: string, tagLine: string): Promise<LolAccountData | null> => {
  const API_URL = "http://localhost:3002/api/getPUUID";

  try {
    // Fetch PUUID
    const puuidResponse = await axios.get(`${API_URL}/${gameName}/${tagLine}`);
    const playerData = puuidResponse.data;

    if (playerData.puuid) {
      // Fetch Summoner Data
      const summonerDataResponse = await axios.get(`http://localhost:3002/api/getSummonerData/${playerData.puuid}`);
      const summonerData = summonerDataResponse.data;

      const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/${summonerData.profileIconId}.png`;

      // Fetch Rank Data
      const rankDataResponse = await axios.get(`http://localhost:3002/api/getRank/${summonerData.id}`);
      const allRankData: LolAccountStats[] = rankDataResponse.data;

      // Filter out "CHERRY" queue type and add winrate
      const filteredRankData = allRankData
        .filter(entry => entry.queueType !== "CHERRY")
        .map(entry => {
          const totalGames = entry.wins + entry.losses;
          const winrate = totalGames > 0 ? (entry.wins / totalGames) * 100 : 0;
          return { ...entry, winrate: parseFloat(winrate.toFixed(2)) };
        });

        // Fetch Normal Draft and Blind Pick stats separately
      const normalDraftStats = await fetchNormalQueueStats(playerData.puuid, 400);
      const normalBlindStats = await fetchNormalQueueStats(playerData.puuid, 430);


      // Combine Data
      const lolAccountData: LolAccountData = {
        summonerId: summonerData.id, // Assigning summonerId here
        name: summonerData.name,
        summonerLevel: summonerData.summonerLevel,
        profileIconId: summonerData.profileIconId,
        profileIconURL: profileIconUrl,
        stats: [...filteredRankData, normalDraftStats, normalBlindStats],
      };

      // Log the final LolAccountData object
      console.log('Final LolAccountData:', lolAccountData);

      return lolAccountData;
    } else {
      alert('Player not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching player data:', error);
    alert('Error fetching player data. Please try again.');
    return null;
  }
};

const fetchNormalQueueStats = async (puuid: string, queueId: number): Promise<LolAccountStats> => {
  const MATCH_API_URL = `http://localhost:3002/api/getQueueStats/${puuid}/${queueId}`;
  
  try {
    const response = await axios.get(MATCH_API_URL);
    const { wins, losses } = response.data;
    const totalGames = wins + losses;
    const winrate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

    const queueType = queueId === 400 ? 'Normal Draft Pick' : 'Normal Blind Pick';

    return {
      queueType,
      wins,
      losses,
      winrate: parseFloat(winrate.toFixed(2)),
      leagueId: '', // Not applicable
      tier: 'N/A', // Not applicable
      rank: 'N/A', // Not applicable
      leaguePoints: 0, // Not applicable
      hotStreak: false, // Not applicable
      veteran: false, // Not applicable
      freshBlood: false, // Not applicable
      inactive: false, // Not applicable
    };
  } catch (error) {
    console.error('Error fetching normal queue stats:', error);
    throw error;
  }
};
