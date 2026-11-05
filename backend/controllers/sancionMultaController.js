const { SancionMulta, Conductor, Vehiculo } = require('../models');

// Obtener todas las sanciones y multas (GET)
const getAllSancionesMultas = async (req, res) => {
  try {
    const multas = await SancionMulta.findAll({
      include: [
        { model: Conductor, as: 'conductor' },
        { model: Vehiculo, as: 'vehiculo' }
      ]
    });
    return res.status(200).json(multas);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las sanciones y multas',
      error: error.message
    });
  }
};

// Obtener una sanción por ID (GET)
const getSancionMultaById = async (req, res) => {
  try {
    const { id } = req.params;
    const multa = await SancionMulta.findByPk(id, {
      include: [
        { model: Conductor, as: 'conductor' },
        { model: Vehiculo, as: 'vehiculo' }
      ]
    });

    if (!multa) {
      return res.status(404).json({
        message: `No se encontró la sanción con id ${id}`
      });
    }

    return res.status(200).json(multa);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la sanción',
      error: error.message
    });
  }
};

// Registrar una nueva sanción / multa (POST)
const createSancionMulta = async (req, res) => {
  try {
    const {
      conductor_id,
      vehiculo_id,
      numero_boleta,
      fecha_infraccion,
      motivo,
      monto_multa,
      estado_pago
    } = req.body;

    if (!conductor_id || !vehiculo_id || !numero_boleta || !fecha_infraccion || !motivo) {
      return res.status(400).json({
        message: 'Los campos conductor_id, vehiculo_id, numero_boleta, fecha_infraccion y motivo son obligatorios'
      });
    }

    const boletaExistente = await SancionMulta.findOne({ where: { numero_boleta } });
    if (boletaExistente) {
      return res.status(400).json({
        message: `Ya existe una multa registrada con la boleta número ${numero_boleta}`
      });
    }

    const conductor = await Conductor.findByPk(conductor_id);
    if (!conductor) {
      return res.status(404).json({
        message: `No se encontró el conductor con id ${conductor_id}`
      });
    }

    const vehiculo = await Vehiculo.findByPk(vehiculo_id);
    if (!vehiculo) {
      return res.status(404).json({
        message: `No se encontró el vehículo con id ${vehiculo_id}`
      });
    }

    const nuevaMulta = await SancionMulta.create({
      conductor_id,
      vehiculo_id,
      numero_boleta,
      fecha_infraccion,
      motivo,
      monto_multa: monto_multa !== undefined ? Number(monto_multa) : 0.00,
      estado_pago: estado_pago || 'pendiente'
    });

    return res.status(201).json({
      message: 'Sanción registrada exitosamente',
      data: nuevaMulta
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar la sanción',
      error: error.message
    });
  }
};

// Actualizar una sanción existente (PUT)
const updateSancionMulta = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      conductor_id,
      vehiculo_id,
      numero_boleta,
      fecha_infraccion,
      motivo,
      monto_multa,
      estado_pago
    } = req.body;

    const multa = await SancionMulta.findByPk(id);
    if (!multa) {
      return res.status(404).json({
        message: `No se encontró la sanción con id ${id}`
      });
    }

    if (numero_boleta && numero_boleta !== multa.numero_boleta) {
      const boletaExistente = await SancionMulta.findOne({ where: { numero_boleta } });
      if (boletaExistente) {
        return res.status(400).json({
          message: `El número de boleta ${numero_boleta} ya está registrado`
        });
      }
    }

    if (conductor_id && conductor_id !== multa.conductor_id) {
      const conductor = await Conductor.findByPk(conductor_id);
      if (!conductor) {
        return res.status(404).json({
          message: `No se encontró el conductor con id ${conductor_id}`
        });
      }
    }

    if (vehiculo_id && vehiculo_id !== multa.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(vehiculo_id);
      if (!vehiculo) {
        return res.status(404).json({
          message: `No se encontró el vehículo con id ${vehiculo_id}`
        });
      }
    }

    await multa.update({
      conductor_id: conductor_id !== undefined ? conductor_id : multa.conductor_id,
      vehiculo_id: vehiculo_id !== undefined ? vehiculo_id : multa.vehiculo_id,
      numero_boleta: numero_boleta !== undefined ? numero_boleta : multa.numero_boleta,
      fecha_infraccion: fecha_infraccion !== undefined ? fecha_infraccion : multa.fecha_infraccion,
      motivo: motivo !== undefined ? motivo : multa.motivo,
      monto_multa: monto_multa !== undefined ? Number(monto_multa) : multa.monto_multa,
      estado_pago: estado_pago !== undefined ? estado_pago : multa.estado_pago
    });

    return res.status(200).json({
      message: 'Sanción actualizada exitosamente',
      data: multa
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la sanción',
      error: error.message
    });
  }
};

// Eliminar una sanción (DELETE)
const deleteSancionMulta = async (req, res) => {
  try {
    const { id } = req.params;

    const multa = await SancionMulta.findByPk(id);
    if (!multa) {
      return res.status(404).json({
        message: `No se encontró la sanción con id ${id}`
      });
    }

    await multa.destroy();

    return res.status(200).json({
      message: `Sanción con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la sanción',
      error: error.message
    });
  }
};

module.exports = {
  getAllSancionesMultas,
  getSancionMultaById,
  createSancionMulta,
  updateSancionMulta,
  deleteSancionMulta
};

