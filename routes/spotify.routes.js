const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

const spotifyService = require("../services/spotifyService");

router.get("/profile", async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "No se proporcionó el token" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
    });

    res.json(response.data); // Enviar datos del usuario al frontend
  } catch (error) {
    if (error.status === 401) {
      console.error("The access token expired:", error.response?.data || error);
      res.status(401).json({ error: "The access token expired" });
    } else {
      console.error(
        "Error obteniendo el perfil:",
        error.response?.data || error
      );
      res.status(500).json({ error: "Error al obtener perfil de usuario" });
    }
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

router.get("/first-track/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params;
    const token = req.headers.authorization; // Suponiendo que el usuario está autenticado

    const firstTrack = await spotifyService.getFirstTrackByArtist(
      token,
      artistId
    );

    if (!firstTrack) {
      return res
        .status(404)
        .json({ message: "No se encontró historial para este artista" });
    }

    res.json(firstTrack);
  } catch (error) {
    console.error("Error al obtener el primer track:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Obtener los tracks más escuchados
router.get("/top-tracks", async (req, res) => {
  try {
    const { time_range, limit } = req.query;
    const accessToken = req.headers.authorization; // Extraer token de autorización

    if (!accessToken) {
      return res.status(401).json({ error: "Token de acceso requerido" });
    }

    const topTracks = await spotifyService.getTopTracks(
      accessToken,
      time_range,
      limit
    );
    res.json({ items: topTracks });
  } catch (error) {
    console.error("Error obteniendo top tracks:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/upload", async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se ha enviado ningún archivo." });
  }

  try {
    // Leer el ZIP desde memoria
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();

    if (zipEntries.length === 0) {
      return res.status(400).json({ error: "El archivo ZIP está vacío." });
    }

    // Obtener el primer archivo dentro del ZIP
    const firstFile = zipEntries[0];
    const fileContent = firstFile.getData().toString("utf8");

    res.json({
      message: "Archivo subido y leído correctamente.",
      firstFileName: firstFile.entryName,
      firstFileContent: fileContent.substring(0, 500),
    });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar el archivo ZIP." });
  }
});

module.exports = router;

module.exports = router;
