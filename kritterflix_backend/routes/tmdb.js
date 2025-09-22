const express = require("express");
const axios = require("axios");
const router = express.Router();

const TMDB_BASE = process.env.TMDB_BASE;

router.get("/*", async (req, res) => {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) throw new Error("TMDB_API_KEY is not defined!");

    
    let path = req.path.startsWith("/") ? req.path.slice(1) : req.path;
    if (!path) path = "tv/popular"; 

    
    const queryParams = { ...req.query, api_key: TMDB_API_KEY };

    const url = `${TMDB_BASE}/${path}`;
    

    const response = await axios.get(url, { params: queryParams });
    res.json(response.data);
  } catch (err) {
    console.error("TMDB proxy error:", err.message);
    const details = err.response ? `${err.response.status} ${err.response.statusText}` : err.message;
    res.status(500).json({ error: "TMDB proxy failed", details });
  }
});

module.exports = router;
