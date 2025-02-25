const axios = require("axios");

async function getFirstTrackByArtist(accessToken, artistId) {
  try {
    let allHistory = [];
    let nextUrl =
      "https://api.spotify.com/v1/me/player/recently-played?limit=30";

    let lastTimestamp = null;

    while (nextUrl) {
      const response = await axios.get(nextUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const history = response.data.items;
      if (history.length === 0) break;

      allHistory = allHistory.concat(history);

      // Obtener el último timestamp para continuar la paginación
      lastTimestamp = new Date(history[history.length - 1].played_at).getTime();
      nextUrl = `https://api.spotify.com/v1/me/player/recently-played?limit=30&before=${lastTimestamp}`;

      console.log(`🔄 Obteniendo más canciones después de: ${lastTimestamp}`);
    }

    console.log(`✅ Se recuperaron ${allHistory.length} canciones en total.`);

    // Filtrar las reproducciones del artista seleccionado
    const artistTracks = allHistory
      .filter((item) =>
        item.track.artists.some((artist) => artist.id === artistId)
      )
      .sort((a, b) => new Date(a.played_at) - new Date(b.played_at));

    if (artistTracks.length === 0) return null;

    const firstTrack = artistTracks[0].track;
    return {
      name: firstTrack.name,
      album: firstTrack.album.name,
      albumImage: firstTrack.album.images[0]?.url,
      playedAt: artistTracks[0].played_at,
    };
  } catch (error) {
    console.error(
      "❌ Error en getFirstTrackByArtist:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function getTopTracks(accessToken, timeRange = "short_term", limit = 10) {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { time_range: timeRange, limit },
      }
    );

    return response.data.items;
  } catch (error) {
    console.error(
      "Error en getTopTracks:",
      error.response?.data || error.message
    );
    throw new Error("No se pudo obtener los tracks más escuchados.");
  }
}

module.exports = { getFirstTrackByArtist };

module.exports = { getTopTracks };
