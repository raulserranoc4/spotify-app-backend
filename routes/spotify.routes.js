const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// 🔹 Obtain user profile
router.get("/profile", async (req, res) => {
  const token = req.headers.authorization;

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
});

// 🔹 Obtain user playlists
router.get("/playlists", async (req, res) => {
  const token = req.headers.authorization;

  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener playlists" });
  }
});

module.exports = router;
