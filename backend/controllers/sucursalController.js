const { Sucursal } = require('../models');

// Obtener todas las sucursales (GET)
const getAllSucursales = async (req, res) => {
  try {
    const sucursales = await Sucursal.findAll();
    return res.status(200).json(sucursales);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las sucursales',
      error: error.message
    });
  }
};

// Obtener una sucursal por ID (GET)
const getSucursalById = async (req, res) => {
  try {
    const { id } = req.params;
    const sucursal = await Sucursal.findByPk(id);

    if (!sucursal) {
      return res.status(404).json({
        message: `No se encontró la sucursal con id ${id}`
      });
    }

    return res.status(200).json(sucursal);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la sucursal',
      error: error.message
    });
  }
};

// Crear una nueva sucursal (POST)
const createSucursal = async (req, res) => {
  try {
    const { nombre, codigo, direccion, telefono, ciudad } = req.body;

    if (!nombre || !codigo) {
      return res.status(400).json({
        message: 'Los campos nombre y codigo son obligatorios'
      });
    }

    // Verificar si el código ya existe
    const codigoExistente = await Sucursal.findOne({ where: { codigo } });
    if (codigoExistente) {
      return res.status(400).json({
        message: `Ya existe una sucursal con el código ${codigo}`
      });
    }

    const nuevaSucursal = await Sucursal.create({
      nombre,
      codigo,
      direccion,
      telefono,
      ciudad
    });

    return res.status(201).json({
      message: 'Sucursal creada exitosamente',
      data: nuevaSucursal
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear la sucursal',
      error: error.message
    });
  }
};

// Actualizar una sucursal existente (PUT)
const updateSucursal = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, codigo, direccion, telefono, ciudad } = req.body;

    const sucursal = await Sucursal.findByPk(id);
    if (!sucursal) {
      return res.status(404).json({
        message: `No se encontró la sucursal con id ${id}`
      });
    }

    // Si se envía un código diferente, verificar que no esté duplicado
    if (codigo && codigo !== sucursal.codigo) {
      const codigoExistente = await Sucursal.findOne({ where: { codigo } });
      if (codigoExistente) {
        return res.status(400).json({
          message: `El código ${codigo} ya está registrado en otra sucursal`
        });
      }
    }

    await sucursal.update({
      nombre: nombre !== undefined ? nombre : sucursal.nombre,
      codigo: codigo !== undefined ? codigo : sucursal.codigo,
      direccion: direccion !== undefined ? direccion : sucursal.direccion,
      telefono: telefono !== undefined ? telefono : sucursal.telefono,
      ciudad: ciudad !== undefined ? ciudad : sucursal.ciudad
    });

    return res.status(200).json({
      message: 'Sucursal actualizada exitosamente',
      data: sucursal
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la sucursal',
      error: error.message
    });
  }
};

// Eliminar una sucursal (DELETE)
const deleteSucursal = async (req, res) => {
  try {
    const { id } = req.params;

    const sucursal = await Sucursal.findByPk(id);
    if (!sucursal) {
      return res.status(404).json({
        message: `No se encontró la sucursal con id ${id}`
      });
    }

    await sucursal.destroy();

    return res.status(200).json({
      message: `Sucursal con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la sucursal',
      error: error.message
    });
  }
};

module.exports = {
  getAllSucursales,
  getSucursalById,
  createSucursal,
  updateSucursal,
  deleteSucursal
};

