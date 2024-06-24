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
      console.log(`Fetching PUUID for ${gameName}#${tagLine}`);
      const response = await axios.get(`${ACCOUNT_API_ROUTING_VAL}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
          headers: {
              'X-Riot-Token': API_KEY
          }
      });
      console.log('PUUID Response:', response.data);
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
    console.log(`Fetching summoner data for PUUID: ${puuid}`);
      const accountResponse = await axios.get(`${ACCOUNT_API_ROUTING_VAL}/riot/account/v1/accounts/by-puuid/${puuid}`, {
          headers: {
              'X-Riot-Token': API_KEY
          }
      });
      console.log('Account Response:', accountResponse.data);
      const summonerResponse = await axios.get(`${SUMMONER_API_ROUTING_VAL}/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
          headers: {
              'X-Riot-Token': API_KEY
          }
      });
      console.log('Summoner Response:', summonerResponse.data);
      
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

// Endpoint for fetching match history by PUUID
app.get('/api/getMatchHistory/:puuid', async (req, res) => {
  const { puuid } = req.params;
  const { start = 0 } = req.query;
  try {
    console.log(`Fetching match history for PUUID: ${puuid}`);
    const matchIdsResponse = await axios.get(`${ACCOUNT_API_ROUTING_VAL}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=20`, {
      headers: {
        'X-Riot-Token': API_KEY
      }
    });
    console.log('Match IDs Response:', matchIdsResponse.data);
    const matchIds = matchIdsResponse.data;
    console.log('Match IDs :', matchIds);

    const matchDetails = await fetchMatchDetailsWithDelay(matchIds, puuid, ACCOUNT_API_ROUTING_VAL, API_KEY);
    res.json(matchDetails);
  } catch (error) {
    console.error('Error fetching match history:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching match history', details: error.response ? error.response.data : error.message });
  }
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchMatchDetailsWithDelay(matchIds, puuid, ACCOUNT_API_ROUTING_VAL, API_KEY) {
  const matchDetails = [];
  for (let i = 0; i < matchIds.length; i++) {
    const matchId = matchIds[i];
    try {
      const matchDetailsResponse = await axios.get(`${ACCOUNT_API_ROUTING_VAL}/lol/match/v5/matches/${matchId}`, {
        headers: {
          'X-Riot-Token': API_KEY
        }
      });

      const matchDetailsData = matchDetailsResponse.data;
      const participant = matchDetailsData.info.participants.find(p => p.puuid === puuid);

      matchDetails.push({
        matchId,
        date: new Date(matchDetailsData.info.gameCreation).toLocaleDateString(),
        champion: participant.championName,
        role: participant.role,
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        win: participant.win
      });

      console.log(`Fetched details for match ID: ${matchId}. Waiting for 1 second before next request...`);
      await wait(500); // Wait for 1 second before fetching the next match
    } catch (error) {
      console.error(`Error fetching match details for match ID ${matchId}:`, error.response ? error.response.data : error.message);
      // Handle the error or continue to the next match
    }
  }
  return matchDetails;
}

// Endpoint for fetching league entries by Summoner ID
app.get('/api/getLeagueEntries/:summonerId', async (req, res) => {
  const { summonerId } = req.params;
  try {
      console.log(`Fetching league entries for Summoner ID: ${summonerId}`);
      const response = await axios.get(`${SUMMONER_API_ROUTING_VAL}/lol/league/v4/entries/by-summoner/${summonerId}`, {
          headers: {
              'X-Riot-Token': API_KEY
          }
      });
      console.log('League entries response:', response.data);
      res.json(response.data);
  } catch (error) {
      console.error('Error fetching league entries:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Error fetching league entries', details: error.response ? error.response.data : error.message });
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