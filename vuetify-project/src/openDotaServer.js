const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Endpoint for fetching player data by account ID from OpenDota
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
