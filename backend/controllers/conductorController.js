const { Conductor, Sucursal, Vehiculo, AsignacionViaje } = require('../models');

// Obtener todos los conductores (GET)
const getAllConductores = async (req, res) => {
  try {
    const conductores = await Conductor.findAll({
      include: [{ model: Sucursal, as: 'sucursal' }]
    });
    return res.status(200).json(conductores);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los conductores',
      error: error.message
    });
  }
};

// Obtener un conductor por ID (GET)
const getConductorById = async (req, res) => {
  try {
    const { id } = req.params;
    const conductor = await Conductor.findByPk(id, {
      include: [
        { model: Sucursal, as: 'sucursal' },
        { model: Vehiculo, as: 'vehiculos_asignados' },
        { model: AsignacionViaje, as: 'asignaciones_viaje' }
      ]
    });

    if (!conductor) {
      return res.status(404).json({
        message: `No se encontró el conductor con id ${id}`
      });
    }

    return res.status(200).json(conductor);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el conductor',
      error: error.message
    });
  }
};

// Crear un nuevo conductor (POST)
const createConductor = async (req, res) => {
  try {
    const {
      sucursal_id,
      cedula,
      nombre_completo,
      telefono,
      correo,
      licencia_tipo,
      licencia_vencimiento,
      estado
    } = req.body;

    if (!sucursal_id || !cedula || !nombre_completo || !licencia_tipo || !licencia_vencimiento) {
      return res.status(400).json({
        message: 'Los campos sucursal_id, cedula, nombre_completo, licencia_tipo y licencia_vencimiento son obligatorios'
      });
    }

    // Verificar que exista la sucursal
    const sucursal = await Sucursal.findByPk(sucursal_id);
    if (!sucursal) {
      return res.status(404).json({
        message: `No se encontró la sucursal con id ${sucursal_id}`
      });
    }

    // Verificar cédula duplicada
    const cedulaExistente = await Conductor.findOne({ where: { cedula } });
    if (cedulaExistente) {
      return res.status(400).json({
        message: `Ya existe un conductor registrado con la cédula ${cedula}`
      });
    }

    const nuevoConductor = await Conductor.create({
      sucursal_id,
      cedula,
      nombre_completo,
      telefono,
      correo,
      licencia_tipo,
      licencia_vencimiento,
      estado: estado || 'activo'
    });

    return res.status(201).json({
      message: 'Conductor creado exitosamente',
      data: nuevoConductor
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear el conductor',
      error: error.message
    });
  }
};

// Actualizar un conductor existente (PUT)
const updateConductor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sucursal_id,
      cedula,
      nombre_completo,
      telefono,
      correo,
      licencia_tipo,
      licencia_vencimiento,
      estado
    } = req.body;

    const conductor = await Conductor.findByPk(id);
    if (!conductor) {
      return res.status(404).json({
        message: `No se encontró el conductor con id ${id}`
      });
    }

    if (sucursal_id && sucursal_id !== conductor.sucursal_id) {
      const sucursal = await Sucursal.findByPk(sucursal_id);
      if (!sucursal) {
        return res.status(404).json({
          message: `No se encontró la sucursal con id ${sucursal_id}`
        });
      }
    }

    if (cedula && cedula !== conductor.cedula) {
      const cedulaExistente = await Conductor.findOne({ where: { cedula } });
      if (cedulaExistente) {
        return res.status(400).json({
          message: `La cédula ${cedula} ya está asignada a otro conductor`
        });
      }
    }

    await conductor.update({
      sucursal_id: sucursal_id !== undefined ? sucursal_id : conductor.sucursal_id,
      cedula: cedula !== undefined ? cedula : conductor.cedula,
      nombre_completo: nombre_completo !== undefined ? nombre_completo : conductor.nombre_completo,
      telefono: telefono !== undefined ? telefono : conductor.telefono,
      correo: correo !== undefined ? correo : conductor.correo,
      licencia_tipo: licencia_tipo !== undefined ? licencia_tipo : conductor.licencia_tipo,
      licencia_vencimiento: licencia_vencimiento !== undefined ? licencia_vencimiento : conductor.licencia_vencimiento,
      estado: estado !== undefined ? estado : conductor.estado
    });

    return res.status(200).json({
      message: 'Conductor actualizado exitosamente',
      data: conductor
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el conductor',
      error: error.message
    });
  }
};

// Eliminar un conductor (DELETE)
const deleteConductor = async (req, res) => {
  try {
    const { id } = req.params;

    const conductor = await Conductor.findByPk(id);
    if (!conductor) {
      return res.status(404).json({
        message: `No se encontró el conductor con id ${id}`
      });
    }

    await conductor.destroy();

    return res.status(200).json({
      message: `Conductor con id ${id} eliminado exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el conductor',
      error: error.message
    });
  }
};

module.exports = {
  getAllConductores,
  getConductorById,
  createConductor,
  updateConductor,
  deleteConductor
};

