const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const API_KEY = "RGAPI-ff351174-6c93-43ca-9976-d36b17e2e5f4";
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

//Endpoint for fetching specific summoner data by PUUID
app.get('/api/getQueueStats/:puuid/:queueId', async (req, res) => {
  const { puuid, queueId } = req.params;
  try {
    const response = await axios.get(`${SUMMONER_API_ROUTING_VAL}/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${queueId}`, {
      headers: {
        'X-Riot-Token': API_KEY
      }
    });
    const matchIds = response.data;

    let wins = 0;
    let losses = 0;

    for (const matchId of matchIds) {
      const matchResponse = await axios.get(`${SUMMONER_API_ROUTING_VAL}/lol/match/v5/matches/${matchId}`, {
        headers: {
          'X-Riot-Token': API_KEY
        }
      });
      const matchData = matchResponse.data;
      const participant = matchData.info.participants.find(p => p.puuid === puuid);
      if (participant) {
        if (participant.win) {
          wins++;
        } else {
          losses++;
        }
      }
    }

    res.json({ wins, losses });
  } catch (error) {
    console.error('Error fetching queue stats:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching queue stats', details: error.response ? error.response.data : error.message });
  }
});

// Endpoint for fetching stats
app.get('/api/getRank/:summonerId', async (req, res) => {
  const { summonerId } = req.params;
  try {
    console.log(`summonerId ${summonerId}`);
    const response = await axios.get(`${SUMMONER_API_ROUTING_VAL}/lol/league/v4/entries/by-summoner/${summonerId}`, {
      headers: {
        'X-Riot-Token': API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching rank data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching rank data', details: error.response ? error.response.data : error.message });
  }
});


const FACEIT_API_KEY = '798238e5-2961-4be7-a509-c64dcb24d4bc';
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
    const response = await axios.get(`${FACEIT_API_URL}/players/${playerId}/history`, {
      headers: {
        Authorization: `Bearer ${FACEIT_API_KEY}`
      }
    });

    const matches = response.data.items.slice(0, 10).map(item => {
      let playerStats = null;

      for (const teamId in item.teams) {
        const team = item.teams[teamId];
        const player = team.players.find(p => p.player_id === playerId);
        if (player) {
          playerStats = player.player_stats;
          break;
        }
      }

      return {
        match_id: item.match_id,
        results: playerStats && item.results.winner === playerStats.team_id ? 'Win' : 'Loss',
        kills: playerStats.kills,
        assists: playerStats.assists,
        deaths: playerStats.deaths,
        rating: playerStats.rating,
        date: new Date(item.finished_at * 1000).toLocaleDateString(),
        elo: playerStats.elo,
        label: item.label || 'Unknown'
      };
    });

    res.json(matches);
  } catch (error) {
    console.error('Error fetching FACEIT matches:', error);
    res.status(500).json({ error: 'Error fetching FACEIT matches' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});