const express = require("express");
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const drawRoutes = require("./routes/drawRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const logger = require("./util/logger");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // <--- Asegurate que sea el puerto 5173
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(authRoutes);
app.use(drawRoutes);
app.use(verifyRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info("API listening", { port: PORT });
  });
}

module.exports = app;
