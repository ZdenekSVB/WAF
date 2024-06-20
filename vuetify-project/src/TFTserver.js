const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());


const API_KEY = "RGAPI-5768047d-282f-42f0-8c59-2ed6d5a4e8fc";
const ACCOUNT_API_ROUTING_VAL = "https://europe.api.riotgames.com"; // Assuming this is for account API
const TFT_API_ROUTING_VAL = "https://eun1.api.riotgames.com"; // Assuming this is for TFT API

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

app.get('/api/getTFTData/:puuid', async (req, res) => {
  const { puuid } = req.params;
  try {
    const response = await axios.get(`${TFT_API_ROUTING_VAL}/tft/summoner/v1/summoners/by-puuid/${puuid}`, {
      headers: {
        'X-Riot-Token': API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching TFT data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching TFT data', details: error.response ? error.response.data : error.message });
  }
});

// Add endpoint for fetching match IDs with correct format
app.get('/api/getMatchIDs/:puuid', async (req, res) => {
  const { puuid } = req.params;
  try {
    const start = req.query.start || 0; // Default start to 0 if not provided
    const count = req.query.count || 20; // Default count to 20 if not provided
    const url = `${TFT_API_ROUTING_VAL}/tft/match/v1/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching match IDs:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching match IDs', details: error.response ? error.response.data : error.message });
  }
});

// Endpoint pro získání informací o hře na základě ID hry
app.get('/api/getMatchDetails/:matchId', async (req, res) => {
  const { matchId } = req.params;
  try {
    const url = `${MATCH_API_ROUTING_VAL}/tft/match/v1/matches/${matchId}?api_key=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching match details:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching match details', details: error.response ? error.response.data : error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
