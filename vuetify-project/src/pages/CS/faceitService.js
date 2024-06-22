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

export const getFaceitStats = async (player_id) => {
  try {
    const response = await axios.get(`${API_URL}/getFaceitStats/${player_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FACEIT stats:', error);
    throw error;
  }
};

export const getFaceitMatchHistory = async (player_id) => {
  try {
    const response = await axios.get(`${API_URL}/getFaceitMatches/${player_id}`);
    return response.data.items.map(item => {
      let playerStats = null;
      Object.values(item.teams).forEach(team => {
        const player = team.players.find(player => player.player_id === player_id);
        if (player) {
          playerStats = player.player_stats;
        }
      });
      return {
        match_id: item.match_id,
        results: item.results.winner === playerStats.team_id ? 'Win' : 'Loss',
        kills: playerStats.kills,
        assists: playerStats.assists,
        deaths: playerStats.deaths,
        rating: playerStats.rating,
        date: new Date(item.finished_at * 1000).toLocaleDateString(),
        elo: playerStats.elo,
        label: item.label || 'Unknown'
      };
    });
  } catch (error) {
    console.error('Error fetching FACEIT match history:', error);
    throw error;
  }
};
