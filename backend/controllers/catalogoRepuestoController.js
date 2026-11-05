const { CatalogoRepuesto, DetalleRepuestoOrden } = require('../models');

// Obtener todos los repuestos (GET)
const getAllCatalogoRepuestos = async (req, res) => {
  try {
    const repuestos = await CatalogoRepuesto.findAll();
    return res.status(200).json(repuestos);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el catálogo de repuestos',
      error: error.message
    });
  }
};

// Obtener un repuesto por ID (GET)
const getCatalogoRepuestoById = async (req, res) => {
  try {
    const { id } = req.params;
    const repuesto = await CatalogoRepuesto.findByPk(id, {
      include: [{ model: DetalleRepuestoOrden, as: 'detalles_orden' }]
    });

    if (!repuesto) {
      return res.status(404).json({
        message: `No se encontró el repuesto con id ${id}`
      });
    }

    return res.status(200).json(repuesto);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el repuesto',
      error: error.message
    });
  }
};

// Crear un nuevo repuesto en el catálogo (POST)
const createCatalogoRepuesto = async (req, res) => {
  try {
    const { codigo_parte, nombre, categoria_repuesto, precio_referencia, stock_almacen } = req.body;

    if (!codigo_parte || !nombre) {
      return res.status(400).json({
        message: 'Los campos codigo_parte y nombre son obligatorios'
      });
    }

    const parteExistente = await CatalogoRepuesto.findOne({ where: { codigo_parte } });
    if (parteExistente) {
      return res.status(400).json({
        message: `Ya existe un repuesto con el código de parte ${codigo_parte}`
      });
    }

    const nuevoRepuesto = await CatalogoRepuesto.create({
      codigo_parte,
      nombre,
      categoria_repuesto,
      precio_referencia: precio_referencia !== undefined ? precio_referencia : 0.00,
      stock_almacen: stock_almacen !== undefined ? stock_almacen : 0
    });

    return res.status(201).json({
      message: 'Repuesto registrado exitosamente en el catálogo',
      data: nuevoRepuesto
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar el repuesto',
      error: error.message
    });
  }
};

// Actualizar un repuesto existente (PUT)
const updateCatalogoRepuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo_parte, nombre, categoria_repuesto, precio_referencia, stock_almacen } = req.body;

    const repuesto = await CatalogoRepuesto.findByPk(id);
    if (!repuesto) {
      return res.status(404).json({
        message: `No se encontró el repuesto con id ${id}`
      });
    }

    if (codigo_parte && codigo_parte !== repuesto.codigo_parte) {
      const parteExistente = await CatalogoRepuesto.findOne({ where: { codigo_parte } });
      if (parteExistente) {
        return res.status(400).json({
          message: `El código de parte ${codigo_parte} ya está registrado para otro repuesto`
        });
      }
    }

    await repuesto.update({
      codigo_parte: codigo_parte !== undefined ? codigo_parte : repuesto.codigo_parte,
      nombre: nombre !== undefined ? nombre : repuesto.nombre,
      categoria_repuesto: categoria_repuesto !== undefined ? categoria_repuesto : repuesto.categoria_repuesto,
      precio_referencia: precio_referencia !== undefined ? precio_referencia : repuesto.precio_referencia,
      stock_almacen: stock_almacen !== undefined ? stock_almacen : repuesto.stock_almacen
    });

    return res.status(200).json({
      message: 'Repuesto actualizado exitosamente',
      data: repuesto
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el repuesto',
      error: error.message
    });
  }
};

// Eliminar un repuesto del catálogo (DELETE)
const deleteCatalogoRepuesto = async (req, res) => {
  try {
    const { id } = req.params;

    const repuesto = await CatalogoRepuesto.findByPk(id);
    if (!repuesto) {
      return res.status(404).json({
        message: `No se encontró el repuesto con id ${id}`
      });
    }

    await repuesto.destroy();

    return res.status(200).json({
      message: `Repuesto con id ${id} eliminado exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el repuesto',
      error: error.message
    });
  }
};

module.exports = {
  getAllCatalogoRepuestos,
  getCatalogoRepuestoById,
  createCatalogoRepuesto,
  updateCatalogoRepuesto,
  deleteCatalogoRepuesto
};

