const express = require("express");
const drawRoutes = require("./routes/drawRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const logger = require("./util/logger");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

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
