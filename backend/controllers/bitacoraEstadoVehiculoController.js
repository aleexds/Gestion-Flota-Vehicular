const { BitacoraEstadoVehiculo, Vehiculo } = require('../models');

// Obtener todas las entradas de bitácora de estado (GET)
const getAllBitacoraEstadoVehiculo = async (req, res) => {
  try {
    const bitacoras = await BitacoraEstadoVehiculo.findAll({
      include: [{ model: Vehiculo, as: 'vehiculo' }]
    });
    return res.status(200).json(bitacoras);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la bitácora de estados',
      error: error.message
    });
  }
};

// Obtener una entrada de bitácora por ID (GET)
const getBitacoraEstadoVehiculoById = async (req, res) => {
  try {
    const { id } = req.params;
    const bitacora = await BitacoraEstadoVehiculo.findByPk(id, {
      include: [{ model: Vehiculo, as: 'vehiculo' }]
    });

    if (!bitacora) {
      return res.status(404).json({
        message: `No se encontró la entrada de bitácora con id ${id}`
      });
    }

    return res.status(200).json(bitacora);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la entrada de bitácora',
      error: error.message
    });
  }
};

// Crear una nueva entrada en la bitácora y opcionalmente actualizar el estado del vehículo (POST)
const createBitacoraEstadoVehiculo = async (req, res) => {
  try {
    const { vehiculo_id, fecha_cambio, estado_anterior, estado_nuevo, motivo_cambio } = req.body;

    if (!vehiculo_id || !estado_anterior || !estado_nuevo) {
      return res.status(400).json({
        message: 'Los campos vehiculo_id, estado_anterior y estado_nuevo son obligatorios'
      });
    }

    const vehiculo = await Vehiculo.findByPk(vehiculo_id);
    if (!vehiculo) {
      return res.status(404).json({
        message: `No se encontró el vehículo con id ${vehiculo_id}`
      });
    }

    const nuevaBitacora = await BitacoraEstadoVehiculo.create({
      vehiculo_id,
      fecha_cambio: fecha_cambio || new Date(),
      estado_anterior,
      estado_nuevo,
      motivo_cambio
    });

    // Actualizar también el estado en la tabla vehiculos
    await vehiculo.update({ estado: estado_nuevo });

    return res.status(201).json({
      message: 'Cambio de estado registrado en bitácora y aplicado al vehículo',
      data: nuevaBitacora
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar el cambio de estado en la bitácora',
      error: error.message
    });
  }
};

// Actualizar una entrada de bitácora (PUT)
const updateBitacoraEstadoVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { vehiculo_id, fecha_cambio, estado_anterior, estado_nuevo, motivo_cambio } = req.body;

    const bitacora = await BitacoraEstadoVehiculo.findByPk(id);
    if (!bitacora) {
      return res.status(404).json({
        message: `No se encontró la entrada de bitácora con id ${id}`
      });
    }

    if (vehiculo_id && vehiculo_id !== bitacora.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(vehiculo_id);
      if (!vehiculo) {
        return res.status(404).json({
          message: `No se encontró el vehículo con id ${vehiculo_id}`
        });
      }
    }

    await bitacora.update({
      vehiculo_id: vehiculo_id !== undefined ? vehiculo_id : bitacora.vehiculo_id,
      fecha_cambio: fecha_cambio !== undefined ? fecha_cambio : bitacora.fecha_cambio,
      estado_anterior: estado_anterior !== undefined ? estado_anterior : bitacora.estado_anterior,
      estado_nuevo: estado_nuevo !== undefined ? estado_nuevo : bitacora.estado_nuevo,
      motivo_cambio: motivo_cambio !== undefined ? motivo_cambio : bitacora.motivo_cambio
    });

    return res.status(200).json({
      message: 'Entrada de bitácora actualizada exitosamente',
      data: bitacora
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la entrada de bitácora',
      error: error.message
    });
  }
};

// Eliminar una entrada de bitácora (DELETE)
const deleteBitacoraEstadoVehiculo = async (req, res) => {
  try {
    const { id } = req.params;

    const bitacora = await BitacoraEstadoVehiculo.findByPk(id);
    if (!bitacora) {
      return res.status(404).json({
        message: `No se encontró la entrada de bitácora con id ${id}`
      });
    }

    await bitacora.destroy();

    return res.status(200).json({
      message: `Entrada de bitácora con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la entrada de bitácora',
      error: error.message
    });
  }
};

module.exports = {
  getAllBitacoraEstadoVehiculo,
  getBitacoraEstadoVehiculoById,
  createBitacoraEstadoVehiculo,
  updateBitacoraEstadoVehiculo,
  deleteBitacoraEstadoVehiculo
};

