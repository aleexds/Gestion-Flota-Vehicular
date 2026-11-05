const { Ruta, Sucursal, AsignacionViaje } = require('../models');

// Obtener todas las rutas (GET)
const getAllRutas = async (req, res) => {
  try {
    const rutas = await Ruta.findAll({
      include: [
        { model: Sucursal, as: 'sucursal_origen' }
      ]
    });
    return res.status(200).json(rutas);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las rutas',
      error: error.message
    });
  }
};

// Obtener una ruta por ID (GET)
const getRutaById = async (req, res) => {
  try {
    const { id } = req.params;
    const ruta = await Ruta.findByPk(id, {
      include: [
        { model: Sucursal, as: 'sucursal_origen' },
        { model: AsignacionViaje, as: 'asignaciones_viaje' }
      ]
    });

    if (!ruta) {
      return res.status(404).json({
        message: `No se encontró la ruta con id ${id}`
      });
    }

    return res.status(200).json(ruta);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la ruta',
      error: error.message
    });
  }
};

// Crear una nueva ruta (POST)
const createRuta = async (req, res) => {
  try {
    const { sucursal_origen_id, nombre_ruta, destino, distancia_estimada_km, duracion_estimada_horas } = req.body;

    if (!sucursal_origen_id || !nombre_ruta || !destino) {
      return res.status(400).json({
        message: 'Los campos sucursal_origen_id, nombre_ruta y destino son obligatorios'
      });
    }

    // Verificar que exista la sucursal de origen
    const sucursal = await Sucursal.findByPk(sucursal_origen_id);
    if (!sucursal) {
      return res.status(404).json({
        message: `No se encontró la sucursal de origen con id ${sucursal_origen_id}`
      });
    }

    const nuevaRuta = await Ruta.create({
      sucursal_origen_id,
      nombre_ruta,
      destino,
      distancia_estimada_km: distancia_estimada_km !== undefined ? distancia_estimada_km : 0.00,
      duracion_estimada_horas: duracion_estimada_horas !== undefined ? duracion_estimada_horas : 0.00
    });

    return res.status(201).json({
      message: 'Ruta creada exitosamente',
      data: nuevaRuta
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear la ruta',
      error: error.message
    });
  }
};

// Actualizar una ruta existente (PUT)
const updateRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const { sucursal_origen_id, nombre_ruta, destino, distancia_estimada_km, duracion_estimada_horas } = req.body;

    const ruta = await Ruta.findByPk(id);
    if (!ruta) {
      return res.status(404).json({
        message: `No se encontró la ruta con id ${id}`
      });
    }

    if (sucursal_origen_id && sucursal_origen_id !== ruta.sucursal_origen_id) {
      const sucursal = await Sucursal.findByPk(sucursal_origen_id);
      if (!sucursal) {
        return res.status(404).json({
          message: `No se encontró la sucursal de origen con id ${sucursal_origen_id}`
        });
      }
    }

    await ruta.update({
      sucursal_origen_id: sucursal_origen_id !== undefined ? sucursal_origen_id : ruta.sucursal_origen_id,
      nombre_ruta: nombre_ruta !== undefined ? nombre_ruta : ruta.nombre_ruta,
      destino: destino !== undefined ? destino : ruta.destino,
      distancia_estimada_km: distancia_estimada_km !== undefined ? distancia_estimada_km : ruta.distancia_estimada_km,
      duracion_estimada_horas: duracion_estimada_horas !== undefined ? duracion_estimada_horas : ruta.duracion_estimada_horas
    });

    return res.status(200).json({
      message: 'Ruta actualizada exitosamente',
      data: ruta
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la ruta',
      error: error.message
    });
  }
};

// Eliminar una ruta (DELETE)
const deleteRuta = async (req, res) => {
  try {
    const { id } = req.params;

    const ruta = await Ruta.findByPk(id);
    if (!ruta) {
      return res.status(404).json({
        message: `No se encontró la ruta con id ${id}`
      });
    }

    await ruta.destroy();

    return res.status(200).json({
      message: `Ruta con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la ruta',
      error: error.message
    });
  }
};

module.exports = {
  getAllRutas,
  getRutaById,
  createRuta,
  updateRuta,
  deleteRuta
};

