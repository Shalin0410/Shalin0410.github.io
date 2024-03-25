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
    console.log(companyProfile);
    res.json(companyProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
});

app.get('/quote/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company quote using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
    const companyQuote = response.data;
    res.json(companyQuote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company quote' });
  }
});

app.get('/news/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company news using ticker
    let fromDate = new Date();
    let toDate = new Date();
    fromDate.setDate(fromDate.getDate() - 8);
    fromDate = fromDate.toISOString().split('T')[0];
    toDate = toDate.toISOString().split('T')[0];

    const response = await axios.get(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${API_KEY}`);
    const companyNews = response.data;
    res.json(companyNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company news' });
  }
});

app.get('/recommendation/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company recommendation using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${API_KEY}`);
    const companyRecommendation = response.data;
    res.json(companyRecommendation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company recommendation' });
  }
});

app.get('/sentiment/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company sentiment using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=2022-01-01&token=${API_KEY}`);
    const companySentiment = response.data;
    res.json(companySentiment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company sentiment' });
  }
});

app.get('/peers/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company peers using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${API_KEY}`);
    const companyPeers = response.data;
    res.json(companyPeers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company peers' });
  }
});

app.get('/earnings/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company earnings using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=${API_KEY}`);
    const companyEarnings = response.data;
    res.json(companyEarnings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company earnings' });
  }
});

app.get('/charts/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company chart using ticker
    let fromDate = new Date();
    let toDate = new Date();
    fromDate.setMonth(toDate.getMonth() - 6);
    fromDate.setDate(fromDate.getDate() - 1);

    fromDate = fromDate.toISOString().split('T')[0];
    toDate = toDate.toISOString().split('T')[0];

    const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=i5ppHPBsTV1OWhtbCpigMuLzc7MYn3F7`);
    const companyChart = response.data;
    res.json(companyChart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company chart' });
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
