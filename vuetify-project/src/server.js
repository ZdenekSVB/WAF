const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

//LOL
const API_KEY = 'RGAPI-9dd55f0b-1a95-4b68-8bf1-1d88abbbf2af';
const ACCOUNT_API_ROUTING_VAL = "https://europe.api.riotgames.com"; 
const SUMMONER_API_ROUTING_VAL = "https://eun1.api.riotgames.com"; 



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

      const gameDuration = matchDetailsData.info.gameEndTimestamp
        ? (matchDetailsData.info.gameEndTimestamp - matchDetailsData.info.gameCreation) / 1000
        : matchDetailsData.info.gameDuration;

        const participants = matchDetailsData.info.participants.map(p => ({
          summonerName: p.summonerName,
          championId: p.championId,
          championName: p.championName,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          role: p.role,
          lane: p.lane,
          teamId: p.teamId,
          win: p.win,
          puuid: p.puuid
        }));
  
        matchDetails.push({
          matchId,
          date: new Date(matchDetailsData.info.gameCreation).toLocaleDateString(),
          duration: `${Math.floor(gameDuration / 60)}m ${Math.floor(gameDuration % 60)}s`,
          gameMode: matchDetailsData.info.gameMode,
          participants,
          win: participant.win
        });

      console.log(`Fetched details for match ID: ${matchId}. Waiting for 1 second before next request...`);
      await wait(500); 
    } catch (error) {
      console.error(`Error fetching match details for match ID ${matchId}:`, error.response ? error.response.data : error.message);
    }
  }
  return matchDetails;
}

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




//FACEIT
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



//TFT
app.get('/api/summoner/:name/:tag', async (req, res) => {
  const { name, tag } = req.params;
  const region =tag.toLowerCase()
  const accountUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${API_KEY}`;

  try {
    const accountResponse = await axios.get(accountUrl);
    console.log('Initial Summoner Data Response:', accountResponse.data);
    const puuid = accountResponse.data.puuid;

    const tftSummonerUrl = `https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
    const tftSummonerResponse = await axios.get(tftSummonerUrl);
    console.log('TFT Summoner Data Response:', tftSummonerResponse.data);

    const summonerId = tftSummonerResponse.data.id;
    const leagueUrl = `https://${region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}?api_key=${API_KEY}`;
    const leagueResponse = await axios.get(leagueUrl);
    console.log('League Data Response:', leagueResponse.data);

    const matchUrl = `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=3&api_key=${API_KEY}`;
    const matchResponse = await axios.get(matchUrl);
    console.log('Match IDs Response:', matchResponse.data);

    const matchDetailsPromises = matchResponse.data.map(async (matchId, index) => {
      const matchDetailsUrl = `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${API_KEY}`;
      const matchDetailsResponse = await axios.get(matchDetailsUrl);

      const participant = matchDetailsResponse.data.info.participants.find(p => p.puuid === puuid);
      if (participant) {
        const filteredParticipant = {
          game_number: index + 1, // Přidání čísla hry
          augments: participant.augments, // Only include augment names
          gold_left: participant.gold_left,
          last_round: participant.last_round,
          level: participant.level,
          missions: participant.missions,
          placement: participant.placement,
          players_eliminated: participant.players_eliminated,
          puuid: participant.puuid,
          time_eliminated: participant.time_eliminated,
          total_damage_to_players: participant.total_damage_to_players,
        };

        console.log(`Participant in match ${matchId}:`, filteredParticipant);
      } else {
        console.error(`Participant with PUUID ${puuid} not found in match ${matchId}`);
      }

      return {
        matchId: matchId,
        matchDetails: matchDetailsResponse.data,
      };
    });

    const matchDetails = await Promise.all(matchDetailsPromises);

    const summonerData = {
      gameName: accountResponse.data.gameName,
      tagLine: accountResponse.data.tagLine,
      summonerLevel: tftSummonerResponse.data.summonerLevel,
      profileIconId: tftSummonerResponse.data.profileIconId,
      leagueData: leagueResponse.data,
      matchIds: matchResponse.data,
      matchDetails: matchDetails,
      puuid: puuid,
    };

    res.json(summonerData);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).send(error.response ? error.response.data : error.message);
  }
});


app.get('/api/leaderboard/:region/:tier/:division', async (req, res) => {
  const { region, tier, division } = req.params;
  const validRegions = ['eun1', 'euw1', 'br1', 'jp1', 'kr', 'la1', 'la2','na1', 'oc1', 'tr1', 'ru', 'ph2', 'sg2', 'th2','tw2', 'vn2'];  
  const validTiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
  const validDivisions = ['I', 'II', 'III', 'IV'];

  if (!validRegions.includes(region) || !validTiers.includes(tier) || !validDivisions.includes(division)) {
    return res.status(400).json({ message: 'Invalid region, tier, or division' });
  }

  const leagueUrl = `https://${region}.api.riotgames.com/tft/league/v1/entries/${tier}/${division}?queue=RANKED_TFT&page=1&api_key=${API_KEY}`;

  try {
    const leagueResponse = await axios.get(leagueUrl);
    const players = leagueResponse.data.slice(0, 20);
    
    console.log('League Data Response:', leagueResponse.data);
    
    const summonerPromises = players.map(async player => {
      const summonerUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/${player.puuid}?api_key=${API_KEY}`;
      const summonerResponse = await axios.get(summonerUrl);
      return {
        summonerName: summonerResponse.data.gameName,
        tier: player.tier,
        rank: player.rank,
        leaguePoints: player.leaguePoints,
        wins: player.wins,
        losses: player.losses
      };
    });

    const summonerData = await Promise.all(summonerPromises);
    res.json(summonerData);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).send(error.response ? error.response.data : error.message);
  }
});

//DOTA
app.get('/api/players/:account_id', async (req, res) => {
  const { account_id } = req.params;
  try {
    const response = await axios.get(`https://api.opendota.com/api/players/${account_id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching player data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching player data', details: error.response ? error.response.data : error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});