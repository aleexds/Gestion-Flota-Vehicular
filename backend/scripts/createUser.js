require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Usuario } = require('../models');

const promptHidden = (label) => new Promise((resolve, reject) => {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    reject(new Error('Ejecuta este script desde una terminal interactiva.'));
    return;
  }

  process.stdout.write(label);
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  let value = '';

  const onData = (character) => {
    if (character === '\u0003') {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      reject(new Error('Operación cancelada.'));
      return;
    }
    if (character === '\r' || character === '\n') {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener('data', onData);
      process.stdout.write('\n');
      resolve(value);
      return;
    }
    if (character === '\u007f' || character === '\b') {
      value = value.slice(0, -1);
      return;
    }
    value += character;
  };

  process.stdin.on('data', onData);
});

const main = async () => {
  const [nombre, correoArg, perfil] = process.argv.slice(2);
  if (!nombre || !correoArg || !perfil) {
    throw new Error('Uso: node scripts/createUser.js "Nombre" correo@empresa.com perfil');
  }

  const correo = correoArg.trim().toLowerCase();
  const password = await promptHidden('Contraseña (mínimo 12 caracteres): ');
  if (password.length < 12) throw new Error('La contraseña debe tener al menos 12 caracteres.');

  await sequelize.authenticate();
  const existing = await Usuario.findOne({ where: { correo } });
  if (existing) throw new Error('Ya existe una cuenta con ese correo.');

  const password_hash = await bcrypt.hash(password, 12);
  const usuario = await Usuario.create({
    nombre: nombre.trim(),
    correo,
    perfil: perfil.trim(),
    password_hash,
    activo: true
  });
  console.log(`Usuario ${usuario.correo} creado con perfil ${usuario.perfil}.`);
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
