import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

export const getFaceitProfile = async (nickname) => {
  try {
    const response = await axios.get(`${API_URL}/getFaceitProfile/${nickname}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FACEIT profile:', error);
    throw error;
  }
};

export const getFaceitStats = async (playerId) => {
  try {
    const response = await axios.get(`${API_URL}/getFaceitStats/${playerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FACEIT stats:', error);
    throw error;
  }
};

export const getFaceitMatchHistory = async (playerId) => {
  try {
    const response = await axios.get(`${API_URL}/getFaceitMatches/${playerId}`);
    return response.data.items.map(item => ({
      match_id: item.match_id,
      results: item.results[0].winner ? 'Win' : 'Loss',
      kills: item.teams[0].players[0].stats.kills, 
      assists: item.teams[0].players[0].stats.assists,
      deaths: item.teams[0].players[0].stats.deaths,
      rating: item.teams[0].players[0].stats.rating,
      date: new Date(item.finished_at * 1000).toLocaleDateString(),
      elo: item.teams[0].players[0].elo, 
      label: item.teams[0].name 
    }));
  } catch (error) {
    console.error('Error fetching FACEIT match history:', error);
    throw error;
  }
};
