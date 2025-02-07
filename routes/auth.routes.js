const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config();

const router = express.Router();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// 🔹 1️⃣ Route to ask authentification with Spotify
router.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email playlist-read-private";

  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify(
    {
      response_type: "code",
      client_id: CLIENT_ID,
      scope: "user-read-private user-read-email playlist-read-private",
      redirect_uri: REDIRECT_URI,
    }
  )}`;

  res.redirect(authUrl);
});

// 🔹 2️⃣ Route to manage callback and obtain token
router.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    res.json({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el token" });
  }
});

module.exports = router;
