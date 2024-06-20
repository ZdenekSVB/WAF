const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const API_KEY = "RGAPI-dd3feb4f-e30e-4649-bf87-9719afcfbeb9";
const ACCOUNT_API_ROUTING_VAL = "https://europe.api.riotgames.com"; // Europe for EUNE accounts
const SUMMONER_API_ROUTING_VAL = "https://eun1.api.riotgames.com"; // EUNE specific region
const TFT_API_ROUTING_VAL = "https://eun1.api.riotgames.com"; // EUNE specific region for TFT

app.get('/api/getPUUID/:gameName/:tagLine', async (req, res) => {
  const { gameName, tagLine } = req.params;
  console.log(`Received gameName: ${gameName}, tagLine: ${tagLine}`);
  try {
    const response = await axios.get(`${ACCOUNT_API_ROUTING_VAL}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
      headers: {
        'X-Riot-Token': API_KEY
      }
    });
    console.log('Response from Riot API:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching PUUID:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching PUUID', details: error.response ? error.response.data : error.message });
  }
});

app.get('/api/getSummonerData/:puuid', async (req, res) => {
  const { puuid } = req.params;
  console.log(`Received PUUID: ${puuid}`);
  try {
    const response = await axios.get(`${SUMMONER_API_ROUTING_VAL}/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
      headers: {
        'X-Riot-Token': API_KEY
      }
    });
    console.log('Response from Riot API:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching user data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching user data', details: error.response ? error.response.data : error.message });
  }
});

app.get('/api/getTFTData/:puuid', async (req, res) => {
  const { puuid } = req.params;
  console.log(`Received PUUID for TFT: ${puuid}`);
  try {
    const response = await axios.get(`${TFT_API_ROUTING_VAL}/tft/summoner/v1/summoners/by-puuid/${puuid}`, {
      headers: {
        'X-Riot-Token': API_KEY
      }
    });
    console.log('Response from Riot API:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching TFT data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching TFT data', details: error.response ? error.response.data : error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
