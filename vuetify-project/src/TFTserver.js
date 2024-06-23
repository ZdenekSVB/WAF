const express = require('express');
const axios = require('axios');
const app = express();
const port = 3003;

const cors = require('cors');
app.use(cors());

const RIOT_API_KEY = 'RGAPI-1284f84c-258a-4803-a521-0c4fb230b5e2';

app.use(express.json());

app.get('/api/summoner/:name/:tag', async (req, res) => {
  const { name, tag } = req.params;
  const accountUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${RIOT_API_KEY}`;

  try {
    const accountResponse = await axios.get(accountUrl);
    console.log('Initial Summoner Data Response:', accountResponse.data);
    const puuid = accountResponse.data.puuid;

    const tftSummonerUrl = `https://eun1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`;
    const tftSummonerResponse = await axios.get(tftSummonerUrl);
    console.log('TFT Summoner Data Response:', tftSummonerResponse.data);

    const summonerId = tftSummonerResponse.data.id;
    const leagueUrl = `https://eun1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}?api_key=${RIOT_API_KEY}`;
    const leagueResponse = await axios.get(leagueUrl);
    console.log('League Data Response:', leagueResponse.data);

    const matchUrl = `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=3&api_key=${RIOT_API_KEY}`;
    const matchResponse = await axios.get(matchUrl);
    console.log('Match IDs Response:', matchResponse.data);

    const matchDetailsPromises = matchResponse.data.map(async (matchId, index) => {
      const matchDetailsUrl = `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${RIOT_API_KEY}`;
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
  const validRegions = [    'eun1', 'euw1', 'br1', 'jp1', 'kr', 'la1', 'la2','na1', 'oc1', 'tr1', 'ru', 'ph2', 'sg2', 'th2','tw2', 'vn2'  ];  
  const validTiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
  const validDivisions = ['I', 'II', 'III', 'IV'];

  if (!validRegions.includes(region) || !validTiers.includes(tier) || !validDivisions.includes(division)) {
    return res.status(400).json({ message: 'Invalid region, tier, or division' });
  }

  const leagueUrl = `https://${region}.api.riotgames.com/tft/league/v1/entries/${tier}/${division}?queue=RANKED_TFT&page=1&api_key=${RIOT_API_KEY}`;

  try {
    const leagueResponse = await axios.get(leagueUrl);
    const players = leagueResponse.data.slice(0, 10);
    
    const summonerPromises = players.map(async player => {
      const summonerUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/${player.puuid}?api_key=${RIOT_API_KEY}`;
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
