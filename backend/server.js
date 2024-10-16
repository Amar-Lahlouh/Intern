const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const myCache = new NodeCache({ stdTTL: 3600 });
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.get("/api/news", async (req, res) => {
  const cachedData = myCache.get("news");
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
    );
    const { articles } = response.data;
    const headlines = articles.map((article) => ({
      title: article.title,
      source: article.source.name,
      publishedAt: article.publishedAt,
      url: article.url,
    }));

    console.log("heads", headlines);
    // Cache the data for an hour (3600 seconds)
    myCache.set("news", headlines);

    res.json(headlines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
