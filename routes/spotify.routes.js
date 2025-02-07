const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.get("/profile", async (req, res) => {
  console.log("hola", req.headers);
  const { authorization } = req.headers; // Recibir el token desde el frontend

  if (!authorization) {
    return res.status(401).json({ error: "No se proporcionó el token" });
  }

  console.log("hola", authorization);
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
    });

    res.json(response.data); // Enviar datos del usuario al frontend
  } catch (error) {
    console.error("Error obteniendo el perfil:", error.response?.data || error);
    res.status(500).json({ error: "Error al obtener perfil de usuario" });
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
