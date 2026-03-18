const AppError = require("../errores/AppError");
const authService = require("../services/authService");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const payload = authService.verifyToken(token);

  if (!payload) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  req.user = payload;
  next();
}

module.exports = authMiddleware;
