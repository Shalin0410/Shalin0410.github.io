const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;
const API_KEY = 'cn961jhr01qoee99obggcn961jhr01qoee99obh0';

// Home Route
app.get('/', (req, res) => {
  res.redirect('/search/home');
});

app.get('/search/home', async (req, res) => {
    const { ticker } = req.params;
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/search?q=${ticker}&token=${API_KEY}`);
        const listofCompanies = response.data;
        res.json(listofCompanies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch list of companies' });
    }
});

// Search Details Route
app.get('/search/:ticker', async (req, res) => {
  const { ticker } = req.params;
  try {
    // Make API call to get company profile using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${API_KEY}`);
    const companyProfile = response.data;
    res.json(companyProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
});

// Watchlist Route
app.get('/watchlist', (req, res) => {
  // Placeholder for watchlist implementation
  res.send('Watchlist Route');
});

// Portfolio Route
app.get('/portfolio', (req, res) => {
  // Placeholder for portfolio implementation
  res.send('Portfolio Route');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
