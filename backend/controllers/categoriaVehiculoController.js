const { CategoriaVehiculo, Vehiculo } = require('../models');

// Obtener todas las categorías de vehículos (GET)
const getAllCategoriasVehiculo = async (req, res) => {
  try {
    const categorias = await CategoriaVehiculo.findAll({
      include: [{ model: Vehiculo, as: 'vehiculos' }]
    });
    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las categorías de vehículos',
      error: error.message
    });
  }
};

// Obtener una categoría de vehículo por ID (GET)
const getCategoriaVehiculoById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaVehiculo.findByPk(id, {
      include: [{ model: Vehiculo, as: 'vehiculos' }]
    });

    if (!categoria) {
      return res.status(404).json({
        message: `No se encontró la categoría de vehículo con id ${id}`
      });
    }

    return res.status(200).json(categoria);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la categoría de vehículo',
      error: error.message
    });
  }
};

// Crear una nueva categoría de vehículo (POST)
const createCategoriaVehiculo = async (req, res) => {
  try {
    const { nombre, requiere_licencia_tipo, intervalo_km_mantenimiento } = req.body;

    if (!nombre || !requiere_licencia_tipo || intervalo_km_mantenimiento === undefined) {
      return res.status(400).json({
        message: 'Los campos nombre, requiere_licencia_tipo e intervalo_km_mantenimiento son obligatorios'
      });
    }

    const nuevaCategoria = await CategoriaVehiculo.create({
      nombre,
      requiere_licencia_tipo,
      intervalo_km_mantenimiento
    });

    return res.status(201).json({
      message: 'Categoría de vehículo creada exitosamente',
      data: nuevaCategoria
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear la categoría de vehículo',
      error: error.message
    });
  }
};

// Actualizar una categoría de vehículo existente (PUT)
const updateCategoriaVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, requiere_licencia_tipo, intervalo_km_mantenimiento } = req.body;

    const categoria = await CategoriaVehiculo.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        message: `No se encontró la categoría de vehículo con id ${id}`
      });
    }

    await categoria.update({
      nombre: nombre !== undefined ? nombre : categoria.nombre,
      requiere_licencia_tipo: requiere_licencia_tipo !== undefined ? requiere_licencia_tipo : categoria.requiere_licencia_tipo,
      intervalo_km_mantenimiento: intervalo_km_mantenimiento !== undefined ? intervalo_km_mantenimiento : categoria.intervalo_km_mantenimiento
    });

    return res.status(200).json({
      message: 'Categoría de vehículo actualizada exitosamente',
      data: categoria
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la categoría de vehículo',
      error: error.message
    });
  }
};

// Eliminar una categoría de vehículo (DELETE)
const deleteCategoriaVehiculo = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await CategoriaVehiculo.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        message: `No se encontró la categoría de vehículo con id ${id}`
      });
    }

    await categoria.destroy();

    return res.status(200).json({
      message: `Categoría de vehículo con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la categoría de vehículo',
      error: error.message
    });
  }
};

module.exports = {
  getAllCategoriasVehiculo,
  getCategoriaVehiculoById,
  createCategoriaVehiculo,
  updateCategoriaVehiculo,
  deleteCategoriaVehiculo
};

