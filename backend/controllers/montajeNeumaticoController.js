const { MontajeNeumatico, Vehiculo, InventarioNeumatico } = require('../models');

// Obtener todos los montajes de neumáticos (GET)
const getAllMontajesNeumaticos = async (req, res) => {
  try {
    const montajes = await MontajeNeumatico.findAll({
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: InventarioNeumatico, as: 'neumatico' }
      ]
    });
    return res.status(200).json(montajes);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los montajes de neumáticos',
      error: error.message
    });
  }
};

// Obtener un montaje por ID (GET)
const getMontajeNeumaticoById = async (req, res) => {
  try {
    const { id } = req.params;
    const montaje = await MontajeNeumatico.findByPk(id, {
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: InventarioNeumatico, as: 'neumatico' }
      ]
    });

    if (!montaje) {
      return res.status(404).json({
        message: `No se encontró el montaje de neumático con id ${id}`
      });
    }

    return res.status(200).json(montaje);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el montaje de neumático',
      error: error.message
    });
  }
};

// Registrar un nuevo montaje de neumático (POST)
const createMontajeNeumatico = async (req, res) => {
  try {
    const {
      vehiculo_id,
      neumatico_id,
      posicion_eje,
      fecha_instalacion,
      km_instalacion,
      fecha_desmonte,
      km_desmonte
    } = req.body;

    if (!vehiculo_id || !neumatico_id || !posicion_eje || !fecha_instalacion || km_instalacion === undefined) {
      return res.status(400).json({
        message: 'Los campos vehiculo_id, neumatico_id, posicion_eje, fecha_instalacion y km_instalacion son obligatorios'
      });
    }

    const vehiculo = await Vehiculo.findByPk(vehiculo_id);
    if (!vehiculo) {
      return res.status(404).json({
        message: `No se encontró el vehículo con id ${vehiculo_id}`
      });
    }

    const neumatico = await InventarioNeumatico.findByPk(neumatico_id);
    if (!neumatico) {
      return res.status(404).json({
        message: `No se encontró el neumático en inventario con id ${neumatico_id}`
      });
    }

    const nuevoMontaje = await MontajeNeumatico.create({
      vehiculo_id,
      neumatico_id,
      posicion_eje,
      fecha_instalacion,
      km_instalacion: Number(km_instalacion),
      fecha_desmonte: fecha_desmonte || null,
      km_desmonte: km_desmonte !== undefined && km_desmonte !== '' ? Number(km_desmonte) : null
    });

    // Actualizar estado del neumático a 'montado'
    await neumatico.update({ estado: 'montado' });

    return res.status(201).json({
      message: 'Montaje de neumático registrado exitosamente',
      data: nuevoMontaje
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar el montaje de neumático',
      error: error.message
    });
  }
};

// Actualizar un montaje existente (PUT)
const updateMontajeNeumatico = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehiculo_id,
      neumatico_id,
      posicion_eje,
      fecha_instalacion,
      km_instalacion,
      fecha_desmonte,
      km_desmonte
    } = req.body;

    const montaje = await MontajeNeumatico.findByPk(id);
    if (!montaje) {
      return res.status(404).json({
        message: `No se encontró el montaje de neumático con id ${id}`
      });
    }

    if (vehiculo_id && vehiculo_id !== montaje.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(vehiculo_id);
      if (!vehiculo) {
        return res.status(404).json({
          message: `No se encontró el vehículo con id ${vehiculo_id}`
        });
      }
    }

    if (neumatico_id && neumatico_id !== montaje.neumatico_id) {
      const neumatico = await InventarioNeumatico.findByPk(neumatico_id);
      if (!neumatico) {
        return res.status(404).json({
          message: `No se encontró el neumático con id ${neumatico_id}`
        });
      }
    }

    await montaje.update({
      vehiculo_id: vehiculo_id !== undefined ? vehiculo_id : montaje.vehiculo_id,
      neumatico_id: neumatico_id !== undefined ? neumatico_id : montaje.neumatico_id,
      posicion_eje: posicion_eje !== undefined ? posicion_eje : montaje.posicion_eje,
      fecha_instalacion: fecha_instalacion !== undefined ? fecha_instalacion : montaje.fecha_instalacion,
      km_instalacion: km_instalacion !== undefined ? Number(km_instalacion) : montaje.km_instalacion,
      fecha_desmonte: fecha_desmonte !== undefined ? fecha_desmonte : montaje.fecha_desmonte,
      km_desmonte: km_desmonte !== undefined && km_desmonte !== '' ? Number(km_desmonte) : montaje.km_desmonte
    });

    // Si se registró fecha de desmonte, actualizar estado del neumático a 'desmontado'
    if (fecha_desmonte) {
      await InventarioNeumatico.update({ estado: 'desmontado' }, { where: { id: montaje.neumatico_id } });
    }

    return res.status(200).json({
      message: 'Montaje de neumático actualizado exitosamente',
      data: montaje
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el montaje de neumático',
      error: error.message
    });
  }
};

// Eliminar un montaje de neumático (DELETE)
const deleteMontajeNeumatico = async (req, res) => {
  try {
    const { id } = req.params;

    const montaje = await MontajeNeumatico.findByPk(id);
    if (!montaje) {
      return res.status(404).json({
        message: `No se encontró el montaje de neumático con id ${id}`
      });
    }

    await montaje.destroy();

    return res.status(200).json({
      message: `Montaje de neumático con id ${id} eliminado exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el montaje de neumático',
      error: error.message
    });
  }
};

module.exports = {
  getAllMontajesNeumaticos,
  getMontajeNeumaticoById,
  createMontajeNeumatico,
  updateMontajeNeumatico,
  deleteMontajeNeumatico
};

