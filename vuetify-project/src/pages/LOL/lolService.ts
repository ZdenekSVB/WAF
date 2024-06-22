import axios from 'axios';
import { LolAccountData } from '@/types/index';

export const fetchUserData = async (gameName: string, tagLine: string): Promise<LolAccountData | null> => {
    const API_URL = "http://localhost:3002/api/getPUUID";

    try {
        const response = await axios.get(`${API_URL}/${gameName}/${tagLine}`);
        const playerData = response.data;

        if (playerData.puuid) {
            const summonerDataResponse = await axios.get(`http://localhost:3002/api/getSummonerData/${playerData.puuid}`);
            const summonerData = summonerDataResponse.data;

            const profileIconURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summonerData.profileIconId}.jpg`;
            console.log(`Received nickname service: ${summonerData.name}`);
            console.log(`Received profileIconID service: ${summonerData.profileIconId}`);
            console.log(`Received profileIconURL service: ${profileIconURL}`);
            console.log(`Received level service: ${summonerData.summonerLevel}`);
            const lolAccountData: LolAccountData = {
                name: summonerData.name,
                summonerLevel: summonerData.summonerLevel,
                profileIconId: summonerData.profileIconId,
                profileIconURL: profileIconURL
            };

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
