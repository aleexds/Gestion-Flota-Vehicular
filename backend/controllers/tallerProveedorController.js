const { TallerProveedor, OrdenMantenimiento } = require('../models');

// Obtener todos los talleres proveedores (GET)
const getAllTalleresProveedores = async (req, res) => {
  try {
    const talleres = await TallerProveedor.findAll({
      include: [{ model: OrdenMantenimiento, as: 'ordenes_mantenimiento' }]
    });
    return res.status(200).json(talleres);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los talleres proveedores',
      error: error.message
    });
  }
};

// Obtener un taller proveedor por ID (GET)
const getTallerProveedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const taller = await TallerProveedor.findByPk(id, {
      include: [{ model: OrdenMantenimiento, as: 'ordenes_mantenimiento' }]
    });

    if (!taller) {
      return res.status(404).json({
        message: `No se encontró el taller proveedor con id ${id}`
      });
    }

    return res.status(200).json(taller);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el taller proveedor',
      error: error.message
    });
  }
};

// Crear un nuevo taller proveedor (POST)
const createTallerProveedor = async (req, res) => {
  try {
    const { cedula_juridica, nombre_comercial, telefono, correo, direccion, especialidad } = req.body;

    if (!cedula_juridica || !nombre_comercial) {
      return res.status(400).json({
        message: 'Los campos cedula_juridica y nombre_comercial son obligatorios'
      });
    }

    const cedulaExistente = await TallerProveedor.findOne({ where: { cedula_juridica } });
    if (cedulaExistente) {
      return res.status(400).json({
        message: `Ya existe un taller registrado con la cédula jurídica ${cedula_juridica}`
      });
    }

    const nuevoTaller = await TallerProveedor.create({
      cedula_juridica,
      nombre_comercial,
      telefono,
      correo,
      direccion,
      especialidad
    });

    return res.status(201).json({
      message: 'Taller proveedor creado exitosamente',
      data: nuevoTaller
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear el taller proveedor',
      error: error.message
    });
  }
};

// Actualizar un taller proveedor existente (PUT)
const updateTallerProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { cedula_juridica, nombre_comercial, telefono, correo, direccion, especialidad } = req.body;

    const taller = await TallerProveedor.findByPk(id);
    if (!taller) {
      return res.status(404).json({
        message: `No se encontró el taller proveedor con id ${id}`
      });
    }

    if (cedula_juridica && cedula_juridica !== taller.cedula_juridica) {
      const cedulaExistente = await TallerProveedor.findOne({ where: { cedula_juridica } });
      if (cedulaExistente) {
        return res.status(400).json({
          message: `La cédula jurídica ${cedula_juridica} ya está registrada en otro taller`
        });
      }
    }

    await taller.update({
      cedula_juridica: cedula_juridica !== undefined ? cedula_juridica : taller.cedula_juridica,
      nombre_comercial: nombre_comercial !== undefined ? nombre_comercial : taller.nombre_comercial,
      telefono: telefono !== undefined ? telefono : taller.telefono,
      correo: correo !== undefined ? correo : taller.correo,
      direccion: direccion !== undefined ? direccion : taller.direccion,
      especialidad: especialidad !== undefined ? especialidad : taller.especialidad
    });

    return res.status(200).json({
      message: 'Taller proveedor actualizado exitosamente',
      data: taller
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el taller proveedor',
      error: error.message
    });
  }
};

// Eliminar un taller proveedor (DELETE)
const deleteTallerProveedor = async (req, res) => {
  try {
    const { id } = req.params;

    const taller = await TallerProveedor.findByPk(id);
    if (!taller) {
      return res.status(404).json({
        message: `No se encontró el taller proveedor con id ${id}`
      });
    }

    await taller.destroy();

    return res.status(200).json({
      message: `Taller proveedor con id ${id} eliminado exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el taller proveedor',
      error: error.message
    });
  }
};

module.exports = {
  getAllTalleresProveedores,
  getTallerProveedorById,
  createTallerProveedor,
  updateTallerProveedor,
  deleteTallerProveedor
};

