// backend/server.js

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const { apiKey } = require("./config");
let timeElapsed = 0;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Function to get a random number between min and max
const getRandomInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// Fetch 20 stocks from the Polygon API and store them in a file
// Make sure to install 'axios' and 'ws' npm packages using 'npm install axios ws'
const axios = require("axios");
const { time } = require("console");
const stocksFile = "stocks.json";

async function fetchAndStoreStocks() {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2024-01-09?adjusted=true&apiKey=${apiKey}`
    );
    response.data.results.splice(20);
    const stocks = response.data.results.map((stock) => ({
      symbol: stock.T,
      openPrice: stock.o,
      refreshInterval: getRandomInterval(1, 5),
    }));
    console.log(`stocks : ${JSON.stringify(stocks)} ${typeof stocks}`);

    fs.writeFileSync(stocksFile, JSON.stringify(stocks));
    console.log("Stocks fetched and stored successfully.");
  } catch (error) {
    console.error("Error fetching and storing stocks:", error.message);
  }
}

// WebSocket logic
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });
});

// Serve the stocks to the frontend via WebSocket
async function broadcastStocks() {
  const stocks = JSON.parse(fs.readFileSync(stocksFile, "utf8"));
  let updatedStock = stocks.map((stock) => ({
    symbol: stock.symbol,
    openPrice: stock.openPrice,
    refreshInterval: stock.refreshInterval,
    currentPrice: stock.openPrice + Math.random() * 10,
  }));

  setInterval(() => {
    // console.log(timeElapsed);
    updatedStock = updatedStock.map((stock) => ({
      ...stock,
      currentPrice:
        timeElapsed % stock.refreshInterval === 0
          ? stock.openPrice + Math.random() * 10
          : stock.currentPrice,
    }));

    wss.clients.forEach((client) => {
      client.send(JSON.stringify(updatedStock));
    });
    timeElapsed++;
  }, 1000);
}

// Initialize the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  fetchAndStoreStocks();
  broadcastStocks();
});
