const { InventarioNeumatico, MontajeNeumatico } = require('../models');

// Obtener todos los neumáticos del inventario (GET)
const getAllInventarioNeumaticos = async (req, res) => {
  try {
    const neumaticos = await InventarioNeumatico.findAll({
      include: [{ model: MontajeNeumatico, as: 'montajes' }]
    });
    return res.status(200).json(neumaticos);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el inventario de neumáticos',
      error: error.message
    });
  }
};

// Obtener un neumático por ID (GET)
const getInventarioNeumaticoById = async (req, res) => {
  try {
    const { id } = req.params;
    const neumatico = await InventarioNeumatico.findByPk(id, {
      include: [{ model: MontajeNeumatico, as: 'montajes' }]
    });

    if (!neumatico) {
      return res.status(404).json({
        message: `No se encontró el neumático con id ${id}`
      });
    }

    return res.status(200).json(neumatico);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el neumático',
      error: error.message
    });
  }
};

// Registrar un nuevo neumático (POST)
const createInventarioNeumatico = async (req, res) => {
  try {
    const { codigo_serie, marca, medida, profundidad_huella_mm, estado } = req.body;

    if (!codigo_serie || !marca || !medida) {
      return res.status(400).json({
        message: 'Los campos codigo_serie, marca y medida son obligatorios'
      });
    }

    const serieExistente = await InventarioNeumatico.findOne({ where: { codigo_serie } });
    if (serieExistente) {
      return res.status(400).json({
        message: `Ya existe un neumático registrado con el código de serie ${codigo_serie}`
      });
    }

    const nuevoNeumatico = await InventarioNeumatico.create({
      codigo_serie,
      marca,
      medida,
      profundidad_huella_mm: profundidad_huella_mm !== undefined ? profundidad_huella_mm : 0.00,
      estado: estado || 'nuevo'
    });

    return res.status(201).json({
      message: 'Neumático registrado exitosamente',
      data: nuevoNeumatico
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar el neumático',
      error: error.message
    });
  }
};

// Actualizar un neumático existente (PUT)
const updateInventarioNeumatico = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo_serie, marca, medida, profundidad_huella_mm, estado } = req.body;

    const neumatico = await InventarioNeumatico.findByPk(id);
    if (!neumatico) {
      return res.status(404).json({
        message: `No se encontró el neumático con id ${id}`
      });
    }

    if (codigo_serie && codigo_serie !== neumatico.codigo_serie) {
      const serieExistente = await InventarioNeumatico.findOne({ where: { codigo_serie } });
      if (serieExistente) {
        return res.status(400).json({
          message: `El código de serie ${codigo_serie} ya está en uso por otro neumático`
        });
      }
    }

    await neumatico.update({
      codigo_serie: codigo_serie !== undefined ? codigo_serie : neumatico.codigo_serie,
      marca: marca !== undefined ? marca : neumatico.marca,
      medida: medida !== undefined ? medida : neumatico.medida,
      profundidad_huella_mm: profundidad_huella_mm !== undefined ? profundidad_huella_mm : neumatico.profundidad_huella_mm,
      estado: estado !== undefined ? estado : neumatico.estado
    });

    return res.status(200).json({
      message: 'Neumático actualizado exitosamente',
      data: neumatico
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el neumático',
      error: error.message
    });
  }
};

// Eliminar un neumático (DELETE)
const deleteInventarioNeumatico = async (req, res) => {
  try {
    const { id } = req.params;

    const neumatico = await InventarioNeumatico.findByPk(id);
    if (!neumatico) {
      return res.status(404).json({
        message: `No se encontró el neumático con id ${id}`
      });
    }

    await neumatico.destroy();

    return res.status(200).json({
      message: `Neumático con id ${id} eliminado exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el neumático',
      error: error.message
    });
  }
};

module.exports = {
  getAllInventarioNeumaticos,
  getInventarioNeumaticoById,
  createInventarioNeumatico,
  updateInventarioNeumatico,
  deleteInventarioNeumatico
};

