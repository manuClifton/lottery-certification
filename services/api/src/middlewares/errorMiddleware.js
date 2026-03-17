const logger = require("../util/logger");

function errorMiddleware(error, req, res, next) {
  logger.error(error.message, {
    path: req.path,
    method: req.method
  });

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: error.message || "Internal Server Error"
    }
  });
}

module.exports = errorMiddleware;
