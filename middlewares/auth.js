const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const usersService = require("../api/users/users.service");

module.exports = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    
    // Vérifier si le token est dans le header Authorization
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw "not token";
    }

    const decoded = jwt.verify(token, config.secretJwtToken);
    const user = await usersService.get(decoded.userId);
    if (!user) {
      throw new UnauthorizedError("Utilisateur non trouvé");
    }
    req.user = user;
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
