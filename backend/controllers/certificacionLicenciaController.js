const { CertificacionLicencia, Conductor } = require('../models');

// Obtener todas las certificaciones / credenciales (GET)
const getAllCertificacionesLicencias = async (req, res) => {
  try {
    const certificaciones = await CertificacionLicencia.findAll({
      include: [{ model: Conductor, as: 'conductor' }]
    });
    return res.status(200).json(certificaciones);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las certificaciones y licencias',
      error: error.message
    });
  }
};

// Obtener una certificación por ID (GET)
const getCertificacionLicenciaById = async (req, res) => {
  try {
    const { id } = req.params;
    const certificacion = await CertificacionLicencia.findByPk(id, {
      include: [{ model: Conductor, as: 'conductor' }]
    });

    if (!certificacion) {
      return res.status(404).json({
        message: `No se encontró la certificación con id ${id}`
      });
    }

    return res.status(200).json(certificacion);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la certificación',
      error: error.message
    });
  }
};

// Crear una nueva certificación (POST)
const createCertificacionLicencia = async (req, res) => {
  try {
    const { conductor_id, tipo_credencial, entidad_emisora, fecha_emision, fecha_vencimiento, estado } = req.body;

    if (!conductor_id || !tipo_credencial || !entidad_emisora || !fecha_emision || !fecha_vencimiento) {
      return res.status(400).json({
        message: 'Los campos conductor_id, tipo_credencial, entidad_emisora, fecha_emision y fecha_vencimiento son obligatorios'
      });
    }

    const conductor = await Conductor.findByPk(conductor_id);
    if (!conductor) {
      return res.status(404).json({
        message: `No se encontró el conductor con id ${conductor_id}`
      });
    }

    const nuevaCertificacion = await CertificacionLicencia.create({
      conductor_id,
      tipo_credencial,
      entidad_emisora,
      fecha_emision,
      fecha_vencimiento,
      estado: estado || 'vigente'
    });

    return res.status(201).json({
      message: 'Certificación registrada exitosamente',
      data: nuevaCertificacion
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar la certificación',
      error: error.message
    });
  }
};

// Actualizar una certificación existente (PUT)
const updateCertificacionLicencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { conductor_id, tipo_credencial, entidad_emisora, fecha_emision, fecha_vencimiento, estado } = req.body;

    const certificacion = await CertificacionLicencia.findByPk(id);
    if (!certificacion) {
      return res.status(404).json({
        message: `No se encontró la certificación con id ${id}`
      });
    }

    if (conductor_id && conductor_id !== certificacion.conductor_id) {
      const conductor = await Conductor.findByPk(conductor_id);
      if (!conductor) {
        return res.status(404).json({
          message: `No se encontró el conductor con id ${conductor_id}`
        });
      }
    }

    await certificacion.update({
      conductor_id: conductor_id !== undefined ? conductor_id : certificacion.conductor_id,
      tipo_credencial: tipo_credencial !== undefined ? tipo_credencial : certificacion.tipo_credencial,
      entidad_emisora: entidad_emisora !== undefined ? entidad_emisora : certificacion.entidad_emisora,
      fecha_emision: fecha_emision !== undefined ? fecha_emision : certificacion.fecha_emision,
      fecha_vencimiento: fecha_vencimiento !== undefined ? fecha_vencimiento : certificacion.fecha_vencimiento,
      estado: estado !== undefined ? estado : certificacion.estado
    });

    return res.status(200).json({
      message: 'Certificación actualizada exitosamente',
      data: certificacion
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la certificación',
      error: error.message
    });
  }
};

// Eliminar una certificación (DELETE)
const deleteCertificacionLicencia = async (req, res) => {
  try {
    const { id } = req.params;

    const certificacion = await CertificacionLicencia.findByPk(id);
    if (!certificacion) {
      return res.status(404).json({
        message: `No se encontró la certificación con id ${id}`
      });
    }

    await certificacion.destroy();

    return res.status(200).json({
      message: `Certificación con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la certificación',
      error: error.message
    });
  }
};

module.exports = {
  getAllCertificacionesLicencias,
  getCertificacionLicenciaById,
  createCertificacionLicencia,
  updateCertificacionLicencia,
  deleteCertificacionLicencia
};

