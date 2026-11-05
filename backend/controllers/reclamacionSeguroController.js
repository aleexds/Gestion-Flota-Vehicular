const { ReclamacionSeguro, SiniestroAccidente, PolizaSeguro } = require('../models');

// Obtener todas las reclamaciones de seguro (GET)
const getAllReclamacionesSeguro = async (req, res) => {
  try {
    const reclamaciones = await ReclamacionSeguro.findAll({
      include: [
        { model: SiniestroAccidente, as: 'siniestro' },
        { model: PolizaSeguro, as: 'poliza' }
      ]
    });
    return res.status(200).json(reclamaciones);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las reclamaciones de seguro',
      error: error.message
    });
  }
};

// Obtener una reclamación por ID (GET)
const getReclamacionSeguroById = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamacion = await ReclamacionSeguro.findByPk(id, {
      include: [
        { model: SiniestroAccidente, as: 'siniestro' },
        { model: PolizaSeguro, as: 'poliza' }
      ]
    });

    if (!reclamacion) {
      return res.status(404).json({
        message: `No se encontró la reclamación con id ${id}`
      });
    }

    return res.status(200).json(reclamacion);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la reclamación',
      error: error.message
    });
  }
};

// Registrar una nueva reclamación de seguro (POST)
const createReclamacionSeguro = async (req, res) => {
  try {
    const {
      siniestro_id,
      poliza_id,
      numero_reclamo,
      monto_reclamado,
      monto_deducible_pagado,
      estado_reclamo
    } = req.body;

    if (!siniestro_id || !poliza_id || !numero_reclamo || monto_reclamado === undefined) {
      return res.status(400).json({
        message: 'Los campos siniestro_id, poliza_id, numero_reclamo y monto_reclamado son obligatorios'
      });
    }

    const reclamoExistente = await ReclamacionSeguro.findOne({ where: { numero_reclamo } });
    if (reclamoExistente) {
      return res.status(400).json({
        message: `Ya existe una reclamación con el número ${numero_reclamo}`
      });
    }

    const siniestro = await SiniestroAccidente.findByPk(siniestro_id);
    if (!siniestro) {
      return res.status(404).json({
        message: `No se encontró el siniestro con id ${siniestro_id}`
      });
    }

    const poliza = await PolizaSeguro.findByPk(poliza_id);
    if (!poliza) {
      return res.status(404).json({
        message: `No se encontró la póliza con id ${poliza_id}`
      });
    }

    const nuevaReclamacion = await ReclamacionSeguro.create({
      siniestro_id,
      poliza_id,
      numero_reclamo,
      monto_reclamado: Number(monto_reclamado),
      monto_deducible_pagado: monto_deducible_pagado !== undefined ? Number(monto_deducible_pagado) : 0.00,
      estado_reclamo: estado_reclamo || 'en_evaluacion'
    });

    return res.status(201).json({
      message: 'Reclamación de seguro registrada exitosamente',
      data: nuevaReclamacion
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar la reclamación de seguro',
      error: error.message
    });
  }
};

// Actualizar una reclamación existente (PUT)
const updateReclamacionSeguro = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      siniestro_id,
      poliza_id,
      numero_reclamo,
      monto_reclamado,
      monto_deducible_pagado,
      estado_reclamo
    } = req.body;

    const reclamacion = await ReclamacionSeguro.findByPk(id);
    if (!reclamacion) {
      return res.status(404).json({
        message: `No se encontró la reclamación con id ${id}`
      });
    }

    if (numero_reclamo && numero_reclamo !== reclamacion.numero_reclamo) {
      const reclamoExistente = await ReclamacionSeguro.findOne({ where: { numero_reclamo } });
      if (reclamoExistente) {
        return res.status(400).json({
          message: `El número de reclamo ${numero_reclamo} ya está registrado`
        });
      }
    }

    if (siniestro_id && siniestro_id !== reclamacion.siniestro_id) {
      const siniestro = await SiniestroAccidente.findByPk(siniestro_id);
      if (!siniestro) {
        return res.status(404).json({
          message: `No se encontró el siniestro con id ${siniestro_id}`
        });
      }
    }

    if (poliza_id && poliza_id !== reclamacion.poliza_id) {
      const poliza = await PolizaSeguro.findByPk(poliza_id);
      if (!poliza) {
        return res.status(404).json({
          message: `No se encontró la póliza con id ${poliza_id}`
        });
      }
    }

    await reclamacion.update({
      siniestro_id: siniestro_id !== undefined ? siniestro_id : reclamacion.siniestro_id,
      poliza_id: poliza_id !== undefined ? poliza_id : reclamacion.poliza_id,
      numero_reclamo: numero_reclamo !== undefined ? numero_reclamo : reclamacion.numero_reclamo,
      monto_reclamado: monto_reclamado !== undefined ? Number(monto_reclamado) : reclamacion.monto_reclamado,
      monto_deducible_pagado: monto_deducible_pagado !== undefined ? Number(monto_deducible_pagado) : reclamacion.monto_deducible_pagado,
      estado_reclamo: estado_reclamo !== undefined ? estado_reclamo : reclamacion.estado_reclamo
    });

    return res.status(200).json({
      message: 'Reclamación de seguro actualizada exitosamente',
      data: reclamacion
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la reclamación de seguro',
      error: error.message
    });
  }
};

// Eliminar una reclamación (DELETE)
const deleteReclamacionSeguro = async (req, res) => {
  try {
    const { id } = req.params;

    const reclamacion = await ReclamacionSeguro.findByPk(id);
    if (!reclamacion) {
      return res.status(404).json({
        message: `No se encontró la reclamación con id ${id}`
      });
    }

    await reclamacion.destroy();

    return res.status(200).json({
      message: `Reclamación con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la reclamación',
      error: error.message
    });
  }
};

module.exports = {
  getAllReclamacionesSeguro,
  getReclamacionSeguroById,
  createReclamacionSeguro,
  updateReclamacionSeguro,
  deleteReclamacionSeguro
};

