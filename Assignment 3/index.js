const express = require("express");
const axios = require("axios");
//const mongoose = require("mongoose");

const app = express();

app.listen(3000, () => console.log("Server listening at port 3000"));

const compSymbol = "AAPL";
const API_TOKEN = "cn961jhr01qoee99obggcn961jhr01qoee99obh0"

app.get("/", async (req, res) => {
    const tickerSymbol = compSymbol;
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/search?q=${tickerSymbol}&token=${API_TOKEN}`);
        res.send(response.data);
    } catch (error) {
        console.error(error);
    }

});

app.get("/search/:tickerSymbol", (req, res) => {
    tickerSymbol = req.params.tickerSymbol.toUpperCase();
    res.send("Ticker Symbol: " + tickerSymbol);
});

app.get("/watchlist", (req, res) => {
    res.send("Watchlist");
})

app.get("portfolio", (req, res) => {
    res.send("Portfolio");
})