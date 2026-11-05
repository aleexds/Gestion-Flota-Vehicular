const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { getAllowedProfiles } = require('../middleware/authenticate');

const login = async (req, res) => {
  const { correo, password } = req.body || {};
  if (typeof correo !== 'string' || typeof password !== 'string' || !correo.trim() || !password) {
    return res.status(400).json({ message: 'Ingresa tu correo y contraseña.' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(503).json({ message: 'La autenticación no está configurada en el servidor.' });
  }

  try {
    const usuario = await Usuario.unscoped().findOne({
      attributes: ['id', 'nombre', 'correo', 'password_hash', 'perfil', 'activo'],
      where: { correo: correo.trim().toLowerCase() }
    });
    const validPassword = usuario
      ? await bcrypt.compare(password, usuario.password_hash)
      : false;

    if (!usuario || !validPassword || !usuario.activo) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    if (!getAllowedProfiles().includes(usuario.perfil.toLowerCase())) {
      return res.status(403).json({ message: 'Tu perfil no tiene permiso para ingresar al sistema.' });
    }

    const token = jwt.sign(
      { sub: String(usuario.id) },
      process.env.JWT_SECRET,
      { expiresIn: '8h', issuer: 'fleetops' }
    );

    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'No se pudo iniciar sesión.' });
  }
};

const me = (req, res) => res.status(200).json({ usuario: req.user });

module.exports = { login, me };
