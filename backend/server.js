const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Weather Proxy Endpoint
app.get('/api/weather', async (req, res) => {
  const { place } = req.query;// Expect latitude and longitude from query params

  if (!place) {
    return res.status(400).json({ error: 'Missing place parameter' });
  }

  const apiUrl = `https://weather-api167.p.rapidapi.com/api/weather/full_info?place=${encodeURIComponent(place)}`;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'weather-api167.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      },
    });
    const data = await response.json();
    res.json(data); // Send the weather data back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Moon Phase Proxy Endpoint
app.get('/api/moon-phase', async (req, res) => {
  const apiUrl = 'https://moon-phase.p.rapidapi.com/advanced';

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'X-Rapidapi-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'moon-phase.p.rapidapi.com',
      },
    });
    const data = await response.json();
    res.json(data); // Send moon phase data back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch moon phase data' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});