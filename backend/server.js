const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
//Geocoding Proxy Endpoint
app.get('/api/reverse-geocode', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${process.env.OPENCAGE_API_KEY}`;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('No results from reverse geocoding.');
    }

    const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village;
    const country = data.results[0].components.country_code.toUpperCase();

    if (!city || !country) {
      throw new Error('Reverse geocoding failed to return a valid city or country.');
    }

    res.json({ city, country });
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    res.status(500).json({ error: 'Failed to fetch location data.' });
  }
});

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