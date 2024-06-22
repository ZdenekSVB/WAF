const express = require('express');
const axios = require('axios');
const app = express();
const port = 3003;

const cors = require('cors');
app.use(cors());

const RIOT_API_KEY = 'RGAPI-56ee19bf-cc73-433e-9873-b5d4c289dc57';

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

        const summonerData = {
            gameName: accountResponse.data.gameName,
            tagLine: accountResponse.data.tagLine,
            summonerLevel: tftSummonerResponse.data.summonerLevel,
            profileIconId: tftSummonerResponse.data.profileIconId,
            leagueData: leagueResponse.data
        };

        res.json(summonerData);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).send(error.response ? error.response.data : error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
