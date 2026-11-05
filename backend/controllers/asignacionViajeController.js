const { AsignacionViaje, Vehiculo, Conductor, Ruta } = require('../models');

// Obtener todas las asignaciones de viaje (GET)
const getAllAsignacionesViaje = async (req, res) => {
  try {
    const asignaciones = await AsignacionViaje.findAll({
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: Conductor, as: 'conductor' },
        { model: Ruta, as: 'ruta' }
      ]
    });
    return res.status(200).json(asignaciones);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las asignaciones de viaje',
      error: error.message
    });
  }
};

// Obtener una asignación de viaje por ID (GET)
const getAsignacionViajeById = async (req, res) => {
  try {
    const { id } = req.params;
    const asignacion = await AsignacionViaje.findByPk(id, {
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: Conductor, as: 'conductor' },
        { model: Ruta, as: 'ruta' }
      ]
    });

    if (!asignacion) {
      return res.status(404).json({
        message: `No se encontró la asignación de viaje con id ${id}`
      });
    }

    return res.status(200).json(asignacion);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la asignación de viaje',
      error: error.message
    });
  }
};

// Crear una nueva asignación de viaje (POST)
const createAsignacionViaje = async (req, res) => {
  try {
    const {
      vehiculo_id,
      conductor_id,
      ruta_id,
      fecha_salida,
      fecha_retorno,
      km_inicial,
      km_final,
      estado
    } = req.body;

    if (!vehiculo_id || !conductor_id || !ruta_id || !fecha_salida || km_inicial === undefined) {
      return res.status(400).json({
        message: 'Los campos vehiculo_id, conductor_id, ruta_id, fecha_salida y km_inicial son obligatorios'
      });
    }

    // Validar existencia de vehículo
    const vehiculo = await Vehiculo.findByPk(vehiculo_id);
    if (!vehiculo) {
      return res.status(404).json({
        message: `No se encontró el vehículo con id ${vehiculo_id}`
      });
    }

    // Validar existencia de conductor
    const conductor = await Conductor.findByPk(conductor_id);
    if (!conductor) {
      return res.status(404).json({
        message: `No se encontró el conductor con id ${conductor_id}`
      });
    }

    // Validar existencia de ruta
    const ruta = await Ruta.findByPk(ruta_id);
    if (!ruta) {
      return res.status(404).json({
        message: `No se encontró la ruta con id ${ruta_id}`
      });
    }

    const nuevaAsignacion = await AsignacionViaje.create({
      vehiculo_id,
      conductor_id,
      ruta_id,
      fecha_salida,
      fecha_retorno: fecha_retorno || null,
      km_inicial,
      km_final: km_final !== undefined ? km_final : null,
      estado: estado || 'en_curso'
    });

    return res.status(201).json({
      message: 'Asignación de viaje creada exitosamente',
      data: nuevaAsignacion
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear la asignación de viaje',
      error: error.message
    });
  }
};

// Actualizar una asignación de viaje existente (PUT)
const updateAsignacionViaje = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehiculo_id,
      conductor_id,
      ruta_id,
      fecha_salida,
      fecha_retorno,
      km_inicial,
      km_final,
      estado
    } = req.body;

    const asignacion = await AsignacionViaje.findByPk(id);
    if (!asignacion) {
      return res.status(404).json({
        message: `No se encontró la asignación de viaje con id ${id}`
      });
    }

    if (vehiculo_id && vehiculo_id !== asignacion.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(vehiculo_id);
      if (!vehiculo) {
        return res.status(404).json({
          message: `No se encontró el vehículo con id ${vehiculo_id}`
        });
      }
    }

    if (conductor_id && conductor_id !== asignacion.conductor_id) {
      const conductor = await Conductor.findByPk(conductor_id);
      if (!conductor) {
        return res.status(404).json({
          message: `No se encontró el conductor con id ${conductor_id}`
        });
      }
    }

    if (ruta_id && ruta_id !== asignacion.ruta_id) {
      const ruta = await Ruta.findByPk(ruta_id);
      if (!ruta) {
        return res.status(404).json({
          message: `No se encontró la ruta con id ${ruta_id}`
        });
      }
    }

    await asignacion.update({
      vehiculo_id: vehiculo_id !== undefined ? vehiculo_id : asignacion.vehiculo_id,
      conductor_id: conductor_id !== undefined ? conductor_id : asignacion.conductor_id,
      ruta_id: ruta_id !== undefined ? ruta_id : asignacion.ruta_id,
      fecha_salida: fecha_salida !== undefined ? fecha_salida : asignacion.fecha_salida,
      fecha_retorno: fecha_retorno !== undefined ? fecha_retorno : asignacion.fecha_retorno,
      km_inicial: km_inicial !== undefined ? km_inicial : asignacion.km_inicial,
      km_final: km_final !== undefined ? km_final : asignacion.km_final,
      estado: estado !== undefined ? estado : asignacion.estado
    });

    // Si se completó el viaje y tiene km_final, opcionalmente se actualiza el odómetro del vehículo
    if (km_final && estado === 'completado') {
      await Vehiculo.update(
        { kilometraje_actual: km_final },
        { where: { id: asignacion.vehiculo_id } }
      );
    }

    return res.status(200).json({
      message: 'Asignación de viaje actualizada exitosamente',
      data: asignacion
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la asignación de viaje',
      error: error.message
    });
  }
};

// Eliminar una asignación de viaje (DELETE)
const deleteAsignacionViaje = async (req, res) => {
  try {
    const { id } = req.params;

    const asignacion = await AsignacionViaje.findByPk(id);
    if (!asignacion) {
      return res.status(404).json({
        message: `No se encontró la asignación de viaje con id ${id}`
      });
    }

    await asignacion.destroy();

    return res.status(200).json({
      message: `Asignación de viaje con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la asignación de viaje',
      error: error.message
    });
  }
};

module.exports = {
  getAllAsignacionesViaje,
  getAsignacionViajeById,
  createAsignacionViaje,
  updateAsignacionViaje,
  deleteAsignacionViaje
};

