const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

/**
 * Middleware para autenticar tokens JWT
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
    req.user = user;
    next();
  });
};

/**
 * Middleware para garantir que apenas administradores possam acessar determinadas rotas
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.tipo_usuario !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Permissão de administrador necessária.' });
  }
  next();
};

module.exports = { authenticateToken, authorizeAdmin };
