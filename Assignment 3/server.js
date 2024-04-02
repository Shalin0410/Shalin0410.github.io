const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:4200', methods: 'GET,POST,DELETE,PUT' }));
app.use(express.static('my-app/dist/my-app/browser'));
const port = process.env.PORT || 8080;
const API_KEY = 'co271lhr01qvggedsuogco271lhr01qvggedsup0';

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://shalinshah1998:vKkqoTACCiUfLSUm@stockapplication.clfuiyi.mongodb.net/?retryWrites=true&w=majority&appName=stockApplication';
const client = new MongoClient(uri);
const dbName = 'stockApplication';
const db = client.db(dbName);
const watchlist = db.collection('watchlist');
const portfolio = db.collection('portfolio');
const wallet = db.collection('wallet');
console.log('Connected to MongoDB');
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
    fromDate.setFullYear(fromDate.getFullYear() - 2);

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
  console.log('Watchlist');

  try {
    // Find the documents and convert them to an array
    const docs = await watchlist.find({}).toArray();
    const symbols = docs.map(doc => ({ symbols: doc.symbols, name: doc.name }));
    console.log('Retrieved watchlist:', symbols);
    res.status(200).json(symbols);
  } catch (err) {
    console.error('Failed to retrieve watchlist. Error:', err);
    res.status(500).send('Failed to retrieve watchlist');
  }
});


app.post('/search/add/:symbol', async (req, res) => {
  console.log('Requst: ', req.body);
  const symbol = req.params.symbol;
  const name = req.body.name;
  console.log('Add to Watchlist:', symbol);
  const newDoc = { symbols: symbol, name: name} ;
  try {
    const result = await watchlist.insertOne(newDoc);
    console.log('Added to watchlist:', result);
    res.status(200).send('Added to watchlist');
  } catch (err) {
    console.error('Failed to add to watchlist. Error:', err);
    res.status(500).send('Failed to add to watchlist');
  }
});

app.delete('/search/delete/:symbol', async (req, res) => {
  // Get the symbol from the URL parameters
  const symbol = req.params.symbol;
  console.log('Removing from Watchlist:', symbol);

  try {
    const result = await watchlist.deleteOne({ symbols: symbol });
    console.log('Removed from watchlist:', result);
    res.status(200).send('Removed from watchlist');
  } catch (err) {
    console.error('Failed to remove from watchlist. Error:', err);
    res.status(500).send('Failed to remove from watchlist');
  }
});

app.get('/wallet', async (req, res) => {
  console.log('Wallet');

  try {
    // Find the documents and convert them to an array
    const docs = await wallet.find({}).toArray();
    console.log('Retrieved wallet:', docs);
    const balance = docs[0].balance;
    res.status(200).json(balance);
  } catch (err) {
    console.error('Failed to retrieve wallet. Error:', err);
    res.status(500).send('Failed to retrieve wallet');
  }
});

app.post('/wallet/update/', async (req, res) => {
  const amount = req.body.balance;
  console.log('Update Wallet:', amount);
  try {
    const result = await wallet.updateOne({}, { $set: { balance: amount } });
    console.log('Updated wallet:', result);
    res.status(200).send('Updated wallet');
  } catch (err) {
    console.error('Failed to add to wallet. Error:', err);
    res.status(500).send('Failed to add to wallet');
  }
});

// Watchlist Route
app.get('/portfolio', async (req, res) => { 
  console.log('Portfolio');

  try {
    // Find the documents and convert them to an array
    const docs = await portfolio.find({}).toArray();
    const symbols = docs.map(doc => ({ symbols: doc.symbols, name: doc.name, quantity: doc.quantity, totalCost: doc.totalCost}));
    console.log('Retrieved portfolio:', symbols);
    res.status(200).json(symbols);
  } catch (err) {
    console.error('Failed to retrieve portfolio. Error:', err);
    res.status(500).send('Failed to retrieve portfolio');
  }
});

app.post('/portfolio/add/:symbol', async (req, res) => {
  console.log('Request: ', req.body);
  const symbol = req.params.symbol;
  const name = req.body.name;
  const quantity = req.body.quantity;
  const totalCost = req.body.totalCost;
  const avgCost = totalCost / quantity;
  console.log('Add to portfolio:', symbol);
  const newDoc = { symbols: symbol, name: name, quantity: quantity, totalCost: totalCost, avgCost: avgCost} ;

  try {
    const result = await portfolio.findOneAndUpdate(
      { symbols: symbol }, // filter
      { $set: newDoc }, // update
      { upsert: true, returnOriginal: false } // options
    );

    console.log('Added to portfolio:', result);
    res.status(200).send('Added to portfolio');
  } catch (err) {
    console.error('Failed to add to portfolio. Error:', err);
    res.status(500).send('Failed to add to portfolio');
  }
});

app.delete('/portfolio/delete/:symbol', async (req, res) => {
  // Get the symbol from the URL parameters
  const symbol = req.params.symbol;
  console.log('Removing from Portfolio:', symbol);

  try {
    const result = await portfolio.deleteOne({ symbols: symbol });
    console.log('Removed from portfolio:', result);
    res.status(200).send('Removed from portfolio');
  } catch (err) {
    console.error('Failed to remove from portfolio. Error:', err);
    res.status(500).send('Failed to remove from portfolio');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});