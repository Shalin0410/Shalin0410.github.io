const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
const port = 3000;
const API_KEY = 'co271lhr01qvggedsuogco271lhr01qvggedsup0';

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://shalinshah1998:vKkqoTACCiUfLSUm@stockapplication.clfuiyi.mongodb.net/?retryWrites=true&w=majority&appName=stockApplication';
const dbName = 'stockApplication';

const client = new MongoClient(uri);
// Home Route
// app.get('/', (req, res) => {
//   res.redirect('/search/home');
// });
app.use(express.json());

app.get('/search', async (req, res) => {
    const companyName = req.query.q;
    //console.log('Auto Complete Search: ', companyName);
    const url = `https://finnhub.io/api/v1/search?q=${companyName}&token=${API_KEY}`;
    try {
        const response = await axios.get(url);
        
        //console.log(response.data.result);
        res.json(response.data.result);
    } catch (error) {
        //console.log('Failed to fetch list of companies')
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
    //console.error(error);
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
});

app.get('/quote/:symbol', async (req, res) => {
  const { symbol } = req.params;
  //console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company quote using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
    const companyQuote = response.data;
    res.json(companyQuote);
  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: 'Failed to fetch company quote' });
  }
});

app.get('/news/:symbol', async (req, res) => {
  const { symbol } = req.params;
  //console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company news using ticker
    let fromDate = new Date();
    let toDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    fromDate = fromDate.toISOString().split('T')[0];
    toDate = toDate.toISOString().split('T')[0];

    const response = await axios.get(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${API_KEY}`);
    const companyNews = response.data;
    res.json(companyNews);
  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: 'Failed to fetch company news' });
  }
});

app.get('/recommendation/:symbol', async (req, res) => {
  const { symbol } = req.params;
  //console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company recommendation using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${API_KEY}`);
    const companyRecommendation = response.data;
    res.json(companyRecommendation);
  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: 'Failed to fetch company recommendation' });
  }
});

app.get('/sentiment/:symbol', async (req, res) => {
  const { symbol } = req.params;
  //console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company sentiment using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=2022-01-01&token=${API_KEY}`);
    const companySentiment = response.data;
    res.json(companySentiment);
  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: 'Failed to fetch company sentiment' });
  }
});

app.get('/peers/:symbol', async (req, res) => {
  const { symbol } = req.params;
  //console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company peers using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${API_KEY}`);
    const companyPeers = response.data;
    res.json(companyPeers);
  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: 'Failed to fetch company peers' });
  }
});

app.get('/earnings/:symbol', async (req, res) => {
  const { symbol } = req.params;
  //console.log('Company Ticker: ', symbol);
  try {
    // Make API call to get company earnings using ticker
    const response = await axios.get(`https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=${API_KEY}`);
    const companyEarnings = response.data;
    res.json(companyEarnings);
  } catch (error) {
    //console.error(error);
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

    console.log('Date: ', fromDate, toDate);
    fromDate = fromDate.toISOString().split('T')[0];
    toDate = toDate.toISOString().split('T')[0];

    const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=i5ppHPBsTV1OWhtbCpigMuLzc7MYn3F7`);
    //console.log('Response: ', response.data);
    const companyCharts = response.data;
    res.json(companyCharts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company chart' });
  }
});

app.get('/hourlyCharts/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log('Company Ticker: ', symbol);
  try {
    let currentDate = new Date();
    let offset = -7.0; // PST is UTC-8
    let pstDate = new Date(currentDate.getTime() + offset * 3600 * 1000);
    console.log('PST Date: ', pstDate);

    let hours = pstDate.getHours();
    let minutes = pstDate.getMinutes();
    let dayOfWeek = pstDate.getDay();
    console.log('Day of Week: ', dayOfWeek);
    console.log('Hours: ', hours);
    console.log('Minutes: ', minutes);

    let marketOpen = (dayOfWeek >= 1 && dayOfWeek <= 5) && // Monday to Friday
                 (hours > 6 || (hours === 6 && minutes >= 30)) && // After 6:30 AM
                 hours < 13; // Before 1:00 PM
    console.log('Market Open: ', marketOpen);
    let fromDate, toDate;

    if (marketOpen) {
      toDate = new Date(pstDate);
      fromDate = new Date(toDate);
      fromDate.setDate(fromDate.getDate() - 1);
    } else {
      if (dayOfWeek === 0) { // Sunday
        toDate = new Date(pstDate);
        toDate.setDate(toDate.getDate() - 2);
        fromDate = new Date(toDate);
        fromDate.setDate(fromDate.getDate() - 1);
      } else if (dayOfWeek === 6) { // Saturday
        toDate = new Date(pstDate);
        toDate.setDate(toDate.getDate() - 1);
        fromDate = new Date(toDate);
        fromDate.setDate(fromDate.getDate() - 1);
      } else {
        toDate = new Date(pstDate);
        fromDate = new Date(toDate);
        fromDate.setDate(fromDate.getDate() - 1);
      }
    }
    console.log('From Date: ', fromDate);
    console.log('To Date: ', toDate);
    fromDate = fromDate.toISOString().split('T')[0];
    toDate = toDate.toISOString().split('T')[0];

    const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/hour/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=i5ppHPBsTV1OWhtbCpigMuLzc7MYn3F7`);
    const companyHourlyChart = response.data;
    res.json(companyHourlyChart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company chart' });
  }
});

// Watchlist Route
app.get('/watchlist', async (req, res) => {
  try {
    client.connect();
    const db = client.db(dbName);
    console.log('Connected to MongoDB');
    const watchlist = db.collection('watchlist');
    const stocks = watchlist.find({}).toArray();
    console.log('Stocks: ', stocks);
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// // Portfolio Route
// app.get('/portfolio', (req, res) => {
//   // Placeholder for portfolio implementation
//   res.send('Portfolio Route');
// });

// async function getStocks() {
//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     console.log('Connected to MongoDB');
//     const tradingStocks = db.collection('tradingStocks');
//     const stocks = await tradingStocks.find({}).toArray();
//     console.log('Stocks: ', stocks[0].wallet);
//     return stocks;
//   } finally {
//     await client.close();
//   }
// }
// getStocks().catch(console.dir);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});