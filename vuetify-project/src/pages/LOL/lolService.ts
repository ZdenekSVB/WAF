import axios from 'axios';
import { LolAccountData, LolAccountStats } from '@/types/index';


export const fetchUserData = async (gameName: string, tagLine: string): Promise<LolAccountData | null> => {
    const API_URL = "http://localhost:3002/api/getPUUID";
    try {
      console.log(`Fetching PUUID for ${gameName}#${tagLine}`);
        const response = await axios.get(`${API_URL}/${gameName}/${tagLine}`);
        const playerData = response.data;


        if (playerData.puuid) {
          console.log(`PUUID fetched: ${playerData.puuid}`);
            const summonerDataResponse = await axios.get(`http://localhost:3002/api/getSummonerData/${playerData.puuid}`);
            const summonerData = summonerDataResponse.data;
            
            const profileIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summonerData.profileIconId}.jpg`;
            
            console.log('Fetching match history');
            const matchHistoryResponse = await axios.get(`http://localhost:3002/api/getMatchHistory/${playerData.puuid}`);
            const matchHistory = matchHistoryResponse.data;

            const statsDataResponse = await axios.get(`http://localhost:3002/api/getLeagueEntries/${summonerData.id}`);
            const allStatsData: LolAccountStats[] = statsDataResponse.data;

            // Calculate winrate for each queue type
            const statsWithWinrate = allStatsData.map(entry => {
              const totalGames = entry.wins + entry.losses;
              const winrate = totalGames > 0 ? (entry.wins / totalGames) * 100 : 0;
              return { ...entry, winrate: parseFloat(winrate.toFixed(2)) };
            });

            console.log(`puuid: ${summonerData.id}`)
            
            const lolAccountData: LolAccountData = {
                puuid: summonerData.puuid,
                name: summonerData.name,
                summonerLevel: summonerData.summonerLevel,
                profileIconId: summonerData.profileIconId,
                profileIconURL: profileIconURL,
                matchHistory: matchHistory,
                stats: statsWithWinrate
            };
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