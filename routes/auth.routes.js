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
  const scope = "user-read-private user-read-email";
  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify(
    {
      response_type: "code",
      client_id: CLIENT_ID,
      scope,
      redirect_uri: REDIRECT_URI, // 👈 Asegurar que usa el valor correcto
    }
  )}`;
  res.json({ url: authUrl });
});

// 🔹 2️⃣ Route to manage callback and obtain token
router.get("/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Código no proporcionado" });
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(response.data); // Enviar el token de acceso al frontend
  } catch (error) {
    console.error("Error intercambiando el código por token:", error);
    res.status(500).json({ error: "Error al obtener el token" });
  }
});

module.exports = router;
