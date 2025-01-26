
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  const currentToken = token.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 401, message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(currentToken, process.env.JWT_SECRET);
    console.log(decoded)
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: 'Token invalide', error });
  }
};

module.exports = authMiddleware;