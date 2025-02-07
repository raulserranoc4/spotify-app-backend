require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth.routes");
const spotifyRoutes = require("./routes/spotify.routes");

app.use("/auth", authRoutes);
app.use("/spotify", spotifyRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
