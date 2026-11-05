const { SiniestroAccidente, Vehiculo, Conductor, ReclamacionSeguro } = require('../models');

// Obtener todos los siniestros / accidentes (GET)
const getAllSiniestrosAccidentes = async (req, res) => {
  try {
    const siniestros = await SiniestroAccidente.findAll({
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: Conductor, as: 'conductor' },
        { model: ReclamacionSeguro, as: 'reclamaciones' }
      ]
    });
    return res.status(200).json(siniestros);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los siniestros y accidentes',
      error: error.message
    });
  }
};

// Obtener un siniestro por ID (GET)
const getSiniestroAccidenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const siniestro = await SiniestroAccidente.findByPk(id, {
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: Conductor, as: 'conductor' },
        { model: ReclamacionSeguro, as: 'reclamaciones' }
      ]
    });

    if (!siniestro) {
      return res.status(404).json({
        message: `No se encontró el siniestro con id ${id}`
      });
    }

    return res.status(200).json(siniestro);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el siniestro',
      error: error.message
    });
  }
};

// Registrar un nuevo siniestro (POST)
const createSiniestroAccidente = async (req, res) => {
  try {
    const {
      vehiculo_id,
      conductor_id,
      fecha_hora,
      lugar_evento,
      descripcion_danos,
      monto_estimado_danos,
      terceros_involucrados
    } = req.body;

    if (!vehiculo_id || !conductor_id || !fecha_hora || !lugar_evento) {
      return res.status(400).json({
        message: 'Los campos vehiculo_id, conductor_id, fecha_hora y lugar_evento son obligatorios'
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

    const nuevoSiniestro = await SiniestroAccidente.create({
      vehiculo_id,
      conductor_id,
      fecha_hora,
      lugar_evento,
      descripcion_danos,
      monto_estimado_danos: monto_estimado_danos !== undefined ? Number(monto_estimado_danos) : 0.00,
      terceros_involucrados: terceros_involucrados !== undefined ? Boolean(terceros_involucrados) : false
    });

    return res.status(201).json({
      message: 'Siniestro registrado exitosamente',
      data: nuevoSiniestro
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar el siniestro',
      error: error.message
    });
  }
};

// Actualizar un siniestro existente (PUT)
const updateSiniestroAccidente = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehiculo_id,
      conductor_id,
      fecha_hora,
      lugar_evento,
      descripcion_danos,
      monto_estimado_danos,
      terceros_involucrados
    } = req.body;

    const siniestro = await SiniestroAccidente.findByPk(id);
    if (!siniestro) {
      return res.status(404).json({
        message: `No se encontró el siniestro con id ${id}`
      });
    }

    if (vehiculo_id && vehiculo_id !== siniestro.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(vehiculo_id);
      if (!vehiculo) {
        return res.status(404).json({
          message: `No se encontró el vehículo con id ${vehiculo_id}`
        });
      }
    }

    if (conductor_id && conductor_id !== siniestro.conductor_id) {
      const conductor = await Conductor.findByPk(conductor_id);
      if (!conductor) {
        return res.status(404).json({
          message: `No se encontró el conductor con id ${conductor_id}`
        });
      }
    }

    await siniestro.update({
      vehiculo_id: vehiculo_id !== undefined ? vehiculo_id : siniestro.vehiculo_id,
      conductor_id: conductor_id !== undefined ? conductor_id : siniestro.conductor_id,
      fecha_hora: fecha_hora !== undefined ? fecha_hora : siniestro.fecha_hora,
      lugar_evento: lugar_evento !== undefined ? lugar_evento : siniestro.lugar_evento,
      descripcion_danos: descripcion_danos !== undefined ? descripcion_danos : siniestro.descripcion_danos,
      monto_estimado_danos: monto_estimado_danos !== undefined ? Number(monto_estimado_danos) : siniestro.monto_estimado_danos,
      terceros_involucrados: terceros_involucrados !== undefined ? Boolean(terceros_involucrados) : siniestro.terceros_involucrados
    });

    return res.status(200).json({
      message: 'Siniestro actualizado exitosamente',
      data: siniestro
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el siniestro',
      error: error.message
    });
  }
};

// Eliminar un siniestro (DELETE)
const deleteSiniestroAccidente = async (req, res) => {
  try {
    const { id } = req.params;

    const siniestro = await SiniestroAccidente.findByPk(id);
    if (!siniestro) {
      return res.status(404).json({
        message: `No se encontró el siniestro con id ${id}`
      });
    }

    await siniestro.destroy();

    return res.status(200).json({
      message: `Siniestro con id ${id} eliminado exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el siniestro',
      error: error.message
    });
  }
};

module.exports = {
  getAllSiniestrosAccidentes,
  getSiniestroAccidenteById,
  createSiniestroAccidente,
  updateSiniestroAccidente,
  deleteSiniestroAccidente
};

