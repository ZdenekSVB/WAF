const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const API_KEY = 'RGAPI-11ee69fe-471e-4a67-922f-867711bd36ed';
const ACCOUNT_API_ROUTING_VAL = "https://europe.api.riotgames.com"; 
const SUMMONER_API_ROUTING_VAL = "https://eun1.api.riotgames.com"; 


// Endpoint for fetching PUUID by Riot ID
app.get('/api/getPUUID/:gameName/:tagLine', async (req, res) => {
  const { gameName, tagLine } = req.params;
  try {
      const response = await axios.get(`${ACCOUNT_API_ROUTING_VAL}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
          headers: {
              'X-Riot-Token': API_KEY
          }
      });
      res.json(response.data);
  } catch (error) {
      console.error('Error fetching PUUID:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Error fetching PUUID', details: error.response ? error.response.data : error.message });
  }
});
// Endpoint for fetching summoner data by PUUID
app.get('/api/getSummonerData/:puuid', async (req, res) => {
  const { puuid } = req.params;
  try {
      const accountResponse = await axios.get(`${ACCOUNT_API_ROUTING_VAL}/riot/account/v1/accounts/by-puuid/${puuid}`, {
          headers: {
              'X-Riot-Token': API_KEY
          }
      });
      const summonerResponse = await axios.get(`${SUMMONER_API_ROUTING_VAL}/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
          headers: {
              'X-Riot-Token': API_KEY
          }
      });
      const summonerData = {
          ...summonerResponse.data,
          name: accountResponse.data.gameName 
      };
      res.json(summonerData);
  } catch (error) {
      console.error('Error fetching summoner data:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Error fetching summoner data', details: error.response ? error.response.data : error.message });
  }
});

const FACEIT_API_KEY = '70e13787-dfaa-4e89-8e92-fde2a100d028';
const FACEIT_API_URL = 'https://open.faceit.com/data/v4';

app.get('/api/getFaceitProfile/:nickname', async (req, res) => {
  const { nickname } = req.params;
  console.log(`Received nickname: ${nickname}`);
  try {
    const response = await axios.get(`${FACEIT_API_URL}/players?nickname=${nickname}`, {
      headers: {
        Authorization: `Bearer ${FACEIT_API_KEY}`
      }
    });
    console.log('Response from FACEIT API:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching FACEIT profile:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching FACEIT profile', details: error.response ? error.response.data : error.message });
  }
});

app.get('/api/getFaceitStats/:playerId', async (req, res) => {
  const { playerId } = req.params;
  console.log(`Received player ID: ${playerId}`);
  try {
    const response = await axios.get(`${FACEIT_API_URL}/players/${playerId}/stats/cs2`, {
      headers: {
        Authorization: `Bearer ${FACEIT_API_KEY}`
      }
    });
    console.log('Response from FACEIT API:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching FACEIT stats:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching FACEIT stats', details: error.response ? error.response.data : error.message });
  }
});

app.get('/api/getFaceitMatches/:playerId', async (req, res) => {
  const { playerId } = req.params;
  try {
    const response = await axios.get(`${FACEIT_API_URL}/players/${playerId}/games/cs2/stats?offset=0&limit=10`, {
      headers: {
        Authorization: `Bearer ${FACEIT_API_KEY}`
      }
    });

    const matches = response.data.items.map(item => ({
      match_id: item.stats['Match Id'],
      results: item.stats['Result'] === '1' ? 'Win' : 'Loss',
      kills: item.stats['Kills'],
      assists: item.stats['Assists'],
      deaths: item.stats['Deaths'],
      rating: item.stats['K/D Ratio'],
      date: new Date(item.stats['Created At']).toLocaleDateString(),
      elo: item.stats['Elo'],
      map: item.stats['Map']
    }));

    res.json(matches);
  } catch (error) {
    console.error('Error fetching FACEIT matches:', error);
    res.status(500).json({ error: 'Error fetching FACEIT matches' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});