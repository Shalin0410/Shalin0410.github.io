const axios = require('axios');
const express = require('express');
const app = express();

const API_TOKEN = 'cn961jhr01qoee99obggcn961jhr01qoee99obh0'

tickerSymbol = 'apple'

app.get('/', async (req, res) => {
  const searchTerm = req.query.q;
  const response = await axios.get(`https://finnhub.io/api/v1/search?q=${tickerSymbol}&token=${API_TOKEN}`);
  res.send(response.data);
});

app.get('/search', async (req, res) => {
  const searchTerm = req.query.q;
  const response = await axios.get(`https://finnhub.io/api/v1/search?q=${searchTerm}&token=${API_TOKEN}`);
  res.send(response.data);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});