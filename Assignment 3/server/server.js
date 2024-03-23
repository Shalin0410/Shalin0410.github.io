const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
const port = 3000;
const API_KEY = 'cn961jhr01qoee99obggcn961jhr01qoee99obh0';

// Home Route
// app.get('/', (req, res) => {
//   res.redirect('/search/home');
// });
app.use(express.json());

app.get('/search', async (req, res) => {
    const companyName = req.query.q;
    console.log('Auto Complete Search: ', companyName);
    const url = `https://finnhub.io/api/v1/search?q=${companyName}&token=${API_KEY}`;
    try {
        const response = await axios.get(url);
        
        console.log(response.data.result);
        res.json(response.data.result);
    } catch (error) {
        console.log('Failed to fetch list of companies')
        res.status(500).json({ error: error.message });
    }
});

// Search Details Route
app.get('/search/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company profile using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
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
