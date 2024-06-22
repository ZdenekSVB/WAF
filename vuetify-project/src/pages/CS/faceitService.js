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
    console.log('Processing match items:', response.data.items); // Debugging raw match items

    const matches = response.data.items.map(item => {
      if (item.teams && typeof item.teams === 'object') {
        let playerTeam = null;
        let playerStats = null;

        Object.keys(item.teams).forEach(teamId => {
          const team = item.teams[teamId];
          console.log('Processing team:', team); // Debugging team
          if (team.players && Array.isArray(team.players)) {
            const player = team.players.find(player => player.player_id === player_id);
            if (player) {
              playerTeam = team;
              console.log('Found player:', player); // Debugging player found
              console.log('Player object structure:', player); // Debugging player object structure
              // Log the entire player object to see its structure
              console.log('Full player object:', JSON.stringify(player, null, 2)); 
              playerStats = player.player_stats; // Adjust this line if player stats are in a different field
              console.log('Player stats:', playerStats); // Debugging player stats
            }
          }
        });

        if (playerStats) {
          return {
            match_id: item.match_id,
            results: playerTeam.team_id === item.results.winner ? 'Win' : 'Loss',
            kills: playerStats.kills,
            assists: playerStats.assists,
            deaths: playerStats.deaths,
            rating: playerStats.rating,
            date: new Date(item.finished_at * 1000).toLocaleDateString(),
            elo: playerStats.elo,
            label: item.label || 'Unknown'
          };
        } else {
          console.log('No player stats found for player_id:', player_id); // Debugging player stats not found
        }
      }
      return null;
    }).filter(match => match !== null);

    console.log('Processed matches:', matches); // Debugging processed matches
    return matches;
  } catch (error) {
    console.error('Error fetching FACEIT match history:', error);
    throw error;
  }
};
