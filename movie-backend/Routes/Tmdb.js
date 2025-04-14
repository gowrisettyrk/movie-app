const express = require("express");
const router = express.Router();
const axios = require("axios");

const TMDB_READ_TOKEN = process.env.TMDB_READ_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${TMDB_READ_TOKEN}`,
  accept: "application/json",
};

router.get("/popular", async (req, res) => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, { headers });
      res.json(response.data.results);
    } catch (error) {
      console.error("Error fetching popular movies:", error.response?.data || error.message);
      res.status(500).json({ message: "Failed to fetch popular movies" });
    }
  });
  

router.get("/top-rated", async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, { headers });
    res.json(response.data.results);
  } catch (error) {
    console.error("Error fetching top-rated movies:", error);
    res.status(500).json({ message: "Failed to fetch top-rated movies" });
  }
});

router.get("/upcoming", async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, { headers });
    res.json(response.data.results);
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    res.status(500).json({ message: "Failed to fetch upcoming movies" });
  }
});

module.exports = router;
