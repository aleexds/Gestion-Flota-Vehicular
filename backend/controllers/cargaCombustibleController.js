const { CargaCombustible, Vehiculo, Conductor } = require('../models');

// Obtener todas las recargas de combustible (GET)
const getAllCargasCombustible = async (req, res) => {
  try {
    const cargas = await CargaCombustible.findAll({
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: Conductor, as: 'conductor' }
      ]
    });
    return res.status(200).json(cargas);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las cargas de combustible',
      error: error.message
    });
  }
};

// Obtener una recarga de combustible por ID (GET)
const getCargaCombustibleById = async (req, res) => {
  try {
    const { id } = req.params;
    const carga = await CargaCombustible.findByPk(id, {
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: Conductor, as: 'conductor' }
      ]
    });

    if (!carga) {
      return res.status(404).json({
        message: `No se encontró la carga de combustible con id ${id}`
      });
    }

    return res.status(200).json(carga);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la carga de combustible',
      error: error.message
    });
  }
};

// Registrar una nueva carga de combustible (POST)
const createCargaCombustible = async (req, res) => {
  try {
    const {
      vehiculo_id,
      conductor_id,
      fecha_hora,
      litros,
      costo_total,
      kilometraje_recarga,
      numero_factura
    } = req.body;

    if (!vehiculo_id || !conductor_id || !fecha_hora || litros === undefined || costo_total === undefined || kilometraje_recarga === undefined) {
      return res.status(400).json({
        message: 'Los campos vehiculo_id, conductor_id, fecha_hora, litros, costo_total y kilometraje_recarga son obligatorios'
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

    const nuevaCarga = await CargaCombustible.create({
      vehiculo_id,
      conductor_id,
      fecha_hora,
      litros: Number(litros),
      costo_total: Number(costo_total),
      kilometraje_recarga: Number(kilometraje_recarga),
      numero_factura
    });

    // Opcional: Actualizar el odómetro del vehículo si la recarga tiene un kilometraje mayor
    if (Number(kilometraje_recarga) > Number(vehiculo.kilometraje_actual || 0)) {
      await vehiculo.update({ kilometraje_actual: Number(kilometraje_recarga) });
    }

    return res.status(201).json({
      message: 'Carga de combustible registrada exitosamente',
      data: nuevaCarga
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar la carga de combustible',
      error: error.message
    });
  }
};

// Actualizar una carga de combustible (PUT)
const updateCargaCombustible = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehiculo_id,
      conductor_id,
      fecha_hora,
      litros,
      costo_total,
      kilometraje_recarga,
      numero_factura
    } = req.body;

    const carga = await CargaCombustible.findByPk(id);
    if (!carga) {
      return res.status(404).json({
        message: `No se encontró la carga de combustible con id ${id}`
      });
    }

    if (vehiculo_id && vehiculo_id !== carga.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(vehiculo_id);
      if (!vehiculo) {
        return res.status(404).json({
          message: `No se encontró el vehículo con id ${vehiculo_id}`
        });
      }
    }

    if (conductor_id && conductor_id !== carga.conductor_id) {
      const conductor = await Conductor.findByPk(conductor_id);
      if (!conductor) {
        return res.status(404).json({
          message: `No se encontró el conductor con id ${conductor_id}`
        });
      }
    }

    await carga.update({
      vehiculo_id: vehiculo_id !== undefined ? vehiculo_id : carga.vehiculo_id,
      conductor_id: conductor_id !== undefined ? conductor_id : carga.conductor_id,
      fecha_hora: fecha_hora !== undefined ? fecha_hora : carga.fecha_hora,
      litros: litros !== undefined ? Number(litros) : carga.litros,
      costo_total: costo_total !== undefined ? Number(costo_total) : carga.costo_total,
      kilometraje_recarga: kilometraje_recarga !== undefined ? Number(kilometraje_recarga) : carga.kilometraje_recarga,
      numero_factura: numero_factura !== undefined ? numero_factura : carga.numero_factura
    });

    return res.status(200).json({
      message: 'Carga de combustible actualizada exitosamente',
      data: carga
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la carga de combustible',
      error: error.message
    });
  }
};

// Eliminar una carga de combustible (DELETE)
const deleteCargaCombustible = async (req, res) => {
  try {
    const { id } = req.params;

    const carga = await CargaCombustible.findByPk(id);
    if (!carga) {
      return res.status(404).json({
        message: `No se encontró la carga de combustible con id ${id}`
      });
    }

    await carga.destroy();

    return res.status(200).json({
      message: `Carga de combustible con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la carga de combustible',
      error: error.message
    });
  }
};

module.exports = {
  getAllCargasCombustible,
  getCargaCombustibleById,
  createCargaCombustible,
  updateCargaCombustible,
  deleteCargaCombustible
};

