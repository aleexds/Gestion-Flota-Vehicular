const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const getAllowedProfiles = () => (
  (process.env.ALLOWED_LOGIN_PROFILES || 'administrador,supervisor')
    .split(',')
    .map((profile) => profile.trim().toLowerCase())
    .filter(Boolean)
);

const authenticate = async (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(503).json({ message: 'La autenticación no está configurada en el servidor.' });
  }

  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Debes iniciar sesión para continuar.' });
  }

  try {
    const payload = jwt.verify(token, secret);
    const usuario = await Usuario.findByPk(payload.sub);
    const allowedProfiles = getAllowedProfiles();
    if (!usuario || !usuario.activo || !allowedProfiles.includes(usuario.perfil.toLowerCase())) {
      return res.status(401).json({ message: 'La sesión ya no es válida.' });
    }

    req.user = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      perfil: usuario.perfil
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'La sesión expiró o no es válida.' });
  }
};

module.exports = { authenticate, getAllowedProfiles };
