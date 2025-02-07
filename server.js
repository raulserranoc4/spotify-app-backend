const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const spotifyRoutes = require("./routes/spotify.routes");

dotenv.config(); // Cargar variables de entorno

const app = express();
app.use(cors());
app.use(express.json());

// Usar las rutas de autenticación
app.use("/auth", authRoutes);
app.use("/spotify", spotifyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
