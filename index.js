require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando");
});

// Ruta que devuelve un mensaje después de 2 segundos simulando asincronía
app.get("/message", async (req, res) => {
  try {
    const message = { text: "Hola desde el backend 🚀" };
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el mensaje" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
