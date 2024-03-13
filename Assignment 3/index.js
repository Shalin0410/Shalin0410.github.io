const express = require("express");

const app = express();

app.listen(3000, () => console.log("Server listening at port 3000"));

app.get("/", (req, res) => {
    res.send("Hello World!");
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