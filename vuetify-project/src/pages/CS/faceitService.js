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
    console.log('Match history response:', response.data);  // Add this line
    return response.data;
  } catch (error) {
    console.error('Error fetching FACEIT match history:', error);
    throw error;
  }
};

export const getFaceitEloHistory = async (player_id) => {
  try {
    const response = await axios.get(`${API_URL}/getFaceitEloHistory/${player_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FACEIT ELO history:', error);
    throw error;
  }
};
