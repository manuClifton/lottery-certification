const AppError = require("../errores/AppError");
const authService = require("../services/authService");

function login(req, res, next) {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      throw new AppError("username and password are required", 400);
    }

    const session = authService.login(username, password);

    if (!session) {
      throw new AppError("Invalid credentials", 401);
    }

    res.json({ data: session });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login
};
