const { InspeccionPreViaje, Vehiculo, Conductor } = require('../models');

// Obtener todas las inspecciones pre-viaje (GET)
const getAllInspeccionesPreViaje = async (req, res) => {
  try {
    const inspecciones = await InspeccionPreViaje.findAll({
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: Conductor, as: 'conductor' }
      ]
    });
    return res.status(200).json(inspecciones);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las inspecciones pre-viaje',
      error: error.message
    });
  }
};

// Obtener una inspección por ID (GET)
const getInspeccionPreViajeById = async (req, res) => {
  try {
    const { id } = req.params;
    const inspeccion = await InspeccionPreViaje.findByPk(id, {
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: Conductor, as: 'conductor' }
      ]
    });

    if (!inspeccion) {
      return res.status(404).json({
        message: `No se encontró la inspección pre-viaje con id ${id}`
      });
    }

    return res.status(200).json(inspeccion);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la inspección pre-viaje',
      error: error.message
    });
  }
};

// Registrar una nueva inspección pre-viaje (POST)
const createInspeccionPreViaje = async (req, res) => {
  try {
    const {
      vehiculo_id,
      conductor_id,
      fecha_inspeccion,
      nivel_aceite_ok,
      presion_llantas_ok,
      luces_ok,
      frenos_ok,
      observaciones,
      resultado
    } = req.body;

    if (!vehiculo_id || !conductor_id || !fecha_inspeccion) {
      return res.status(400).json({
        message: 'Los campos vehiculo_id, conductor_id y fecha_inspeccion son obligatorios'
      });
    }

    const vehiculo = await Vehiculo.findByPk(vehiculo_id);
    if (!vehiculo) {
      return res.status(404).json({
        message: `No se encontró el vehículo con id ${vehiculo_id}`
      });
    }

    const conductor = await Conductor.findByPk(conductor_id);
    if (!conductor) {
      return res.status(404).json({
        message: `No se encontró el conductor con id ${conductor_id}`
      });
    }

    // Calcular resultado automático si no se envía explícito
    const aceite = nivel_aceite_ok !== undefined ? Boolean(nivel_aceite_ok) : true;
    const llantas = presion_llantas_ok !== undefined ? Boolean(presion_llantas_ok) : true;
    const luces = luces_ok !== undefined ? Boolean(luces_ok) : true;
    const frenos = frenos_ok !== undefined ? Boolean(frenos_ok) : true;

    const resCalculado = resultado || (aceite && llantas && luces && frenos ? 'aprobado' : 'rechazado');

    const nuevaInspeccion = await InspeccionPreViaje.create({
      vehiculo_id,
      conductor_id,
      fecha_inspeccion,
      nivel_aceite_ok: aceite,
      presion_llantas_ok: llantas,
      luces_ok: luces,
      frenos_ok: frenos,
      observaciones,
      resultado: resCalculado
    });

    return res.status(201).json({
      message: 'Inspección pre-viaje registrada exitosamente',
      data: nuevaInspeccion
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar la inspección pre-viaje',
      error: error.message
    });
  }
};

// Actualizar una inspección existente (PUT)
const updateInspeccionPreViaje = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehiculo_id,
      conductor_id,
      fecha_inspeccion,
      nivel_aceite_ok,
      presion_llantas_ok,
      luces_ok,
      frenos_ok,
      observaciones,
      resultado
    } = req.body;

    const inspeccion = await InspeccionPreViaje.findByPk(id);
    if (!inspeccion) {
      return res.status(404).json({
        message: `No se encontró la inspección pre-viaje con id ${id}`
      });
    }

    if (vehiculo_id && vehiculo_id !== inspeccion.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(vehiculo_id);
      if (!vehiculo) {
        return res.status(404).json({
          message: `No se encontró el vehículo con id ${vehiculo_id}`
        });
      }
    }

    if (conductor_id && conductor_id !== inspeccion.conductor_id) {
      const conductor = await Conductor.findByPk(conductor_id);
      if (!conductor) {
        return res.status(404).json({
          message: `No se encontró el conductor con id ${conductor_id}`
        });
      }
    }

    await inspeccion.update({
      vehiculo_id: vehiculo_id !== undefined ? vehiculo_id : inspeccion.vehiculo_id,
      conductor_id: conductor_id !== undefined ? conductor_id : inspeccion.conductor_id,
      fecha_inspeccion: fecha_inspeccion !== undefined ? fecha_inspeccion : inspeccion.fecha_inspeccion,
      nivel_aceite_ok: nivel_aceite_ok !== undefined ? nivel_aceite_ok : inspeccion.nivel_aceite_ok,
      presion_llantas_ok: presion_llantas_ok !== undefined ? presion_llantas_ok : inspeccion.presion_llantas_ok,
      luces_ok: luces_ok !== undefined ? luces_ok : inspeccion.luces_ok,
      frenos_ok: frenos_ok !== undefined ? frenos_ok : inspeccion.frenos_ok,
      observaciones: observaciones !== undefined ? observaciones : inspeccion.observaciones,
      resultado: resultado !== undefined ? resultado : inspeccion.resultado
    });

    return res.status(200).json({
      message: 'Inspección pre-viaje actualizada exitosamente',
      data: inspeccion
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la inspección pre-viaje',
      error: error.message
    });
  }
};

// Eliminar una inspección pre-viaje (DELETE)
const deleteInspeccionPreViaje = async (req, res) => {
  try {
    const { id } = req.params;

    const inspeccion = await InspeccionPreViaje.findByPk(id);
    if (!inspeccion) {
      return res.status(404).json({
        message: `No se encontró la inspección pre-viaje con id ${id}`
      });
    }

    await inspeccion.destroy();

    return res.status(200).json({
      message: `Inspección pre-viaje con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la inspección pre-viaje',
      error: error.message
    });
  }
};

module.exports = {
  getAllInspeccionesPreViaje,
  getInspeccionPreViajeById,
  createInspeccionPreViaje,
  updateInspeccionPreViaje,
  deleteInspeccionPreViaje
};

