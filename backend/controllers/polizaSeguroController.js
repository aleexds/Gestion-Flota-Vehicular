const { PolizaSeguro, Vehiculo } = require('../models');

// Obtener todas las pólizas de seguro (GET)
const getAllPolizasSeguro = async (req, res) => {
  try {
    const polizas = await PolizaSeguro.findAll({
      include: [{ model: Vehiculo, as: 'vehiculo' }]
    });
    return res.status(200).json(polizas);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las pólizas de seguro',
      error: error.message
    });
  }
};

// Obtener una póliza de seguro por ID (GET)
const getPolizaSeguroById = async (req, res) => {
  try {
    const { id } = req.params;
    const poliza = await PolizaSeguro.findByPk(id, {
      include: [{ model: Vehiculo, as: 'vehiculo' }]
    });

    if (!poliza) {
      return res.status(404).json({
        message: `No se encontró la póliza de seguro con id ${id}`
      });
    }

    return res.status(200).json(poliza);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la póliza de seguro',
      error: error.message
    });
  }
};

// Crear una nueva póliza de seguro (POST)
const createPolizaSeguro = async (req, res) => {
  try {
    const {
      vehiculo_id,
      aseguradora,
      numero_poliza,
      cobertura,
      monto_cobertura,
      fecha_inicio,
      fecha_vencimiento,
      estado
    } = req.body;

    if (!vehiculo_id || !aseguradora || !numero_poliza || !cobertura || !fecha_inicio || !fecha_vencimiento) {
      return res.status(400).json({
        message: 'Los campos vehiculo_id, aseguradora, numero_poliza, cobertura, fecha_inicio y fecha_vencimiento son obligatorios'
      });
    }

    // Verificar que exista el vehículo
    const vehiculo = await Vehiculo.findByPk(vehiculo_id);
    if (!vehiculo) {
      return res.status(404).json({
        message: `No se encontró el vehículo con id ${vehiculo_id}`
      });
    }

    // Verificar número de póliza único
    const polizaExistente = await PolizaSeguro.findOne({ where: { numero_poliza } });
    if (polizaExistente) {
      return res.status(400).json({
        message: `Ya existe una póliza registrada con el número ${numero_poliza}`
      });
    }

    const nuevaPoliza = await PolizaSeguro.create({
      vehiculo_id,
      aseguradora,
      numero_poliza,
      cobertura,
      monto_cobertura: monto_cobertura !== undefined ? monto_cobertura : 0.00,
      fecha_inicio,
      fecha_vencimiento,
      estado: estado || 'vigente'
    });

    return res.status(201).json({
      message: 'Póliza de seguro creada exitosamente',
      data: nuevaPoliza
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear la póliza de seguro',
      error: error.message
    });
  }
};

// Actualizar una póliza de seguro existente (PUT)
const updatePolizaSeguro = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehiculo_id,
      aseguradora,
      numero_poliza,
      cobertura,
      monto_cobertura,
      fecha_inicio,
      fecha_vencimiento,
      estado
    } = req.body;

    const poliza = await PolizaSeguro.findByPk(id);
    if (!poliza) {
      return res.status(404).json({
        message: `No se encontró la póliza de seguro con id ${id}`
      });
    }

    if (vehiculo_id && vehiculo_id !== poliza.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(vehiculo_id);
      if (!vehiculo) {
        return res.status(404).json({
          message: `No se encontró el vehículo con id ${vehiculo_id}`
        });
      }
    }

    if (numero_poliza && numero_poliza !== poliza.numero_poliza) {
      const polizaExistente = await PolizaSeguro.findOne({ where: { numero_poliza } });
      if (polizaExistente) {
        return res.status(400).json({
          message: `El número de póliza ${numero_poliza} ya está registrado`
        });
      }
    }

    await poliza.update({
      vehiculo_id: vehiculo_id !== undefined ? vehiculo_id : poliza.vehiculo_id,
      aseguradora: aseguradora !== undefined ? aseguradora : poliza.aseguradora,
      numero_poliza: numero_poliza !== undefined ? numero_poliza : poliza.numero_poliza,
      cobertura: cobertura !== undefined ? cobertura : poliza.cobertura,
      monto_cobertura: monto_cobertura !== undefined ? monto_cobertura : poliza.monto_cobertura,
      fecha_inicio: fecha_inicio !== undefined ? fecha_inicio : poliza.fecha_inicio,
      fecha_vencimiento: fecha_vencimiento !== undefined ? fecha_vencimiento : poliza.fecha_vencimiento,
      estado: estado !== undefined ? estado : poliza.estado
    });

    return res.status(200).json({
      message: 'Póliza de seguro actualizada exitosamente',
      data: poliza
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la póliza de seguro',
      error: error.message
    });
  }
};

// Eliminar una póliza de seguro (DELETE)
const deletePolizaSeguro = async (req, res) => {
  try {
    const { id } = req.params;

    const poliza = await PolizaSeguro.findByPk(id);
    if (!poliza) {
      return res.status(404).json({
        message: `No se encontró la póliza de seguro con id ${id}`
      });
    }

    await poliza.destroy();

    return res.status(200).json({
      message: `Póliza de seguro con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la póliza de seguro',
      error: error.message
    });
  }
};

module.exports = {
  getAllPolizasSeguro,
  getPolizaSeguroById,
  createPolizaSeguro,
  updatePolizaSeguro,
  deletePolizaSeguro
};

