const { Vehiculo, CategoriaVehiculo, Sucursal, Conductor, PolizaSeguro, OrdenMantenimiento, AsignacionViaje } = require('../models');

// Obtener todos los vehículos (GET)
const getAllVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll({
      include: [
        { model: CategoriaVehiculo, as: 'categoria' },
        { model: Sucursal, as: 'sucursal' },
        { model: Conductor, as: 'conductor_habitual' }
      ]
    });
    return res.status(200).json(vehiculos);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los vehículos',
      error: error.message
    });
  }
};

// Obtener un vehículo por ID (GET)
const getVehiculoById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculo = await Vehiculo.findByPk(id, {
      include: [
        { model: CategoriaVehiculo, as: 'categoria' },
        { model: Sucursal, as: 'sucursal' },
        { model: Conductor, as: 'conductor_habitual' },
        { model: PolizaSeguro, as: 'polizas_seguro' },
        { model: OrdenMantenimiento, as: 'ordenes_mantenimiento' },
        { model: AsignacionViaje, as: 'asignaciones_viaje' }
      ]
    });

    if (!vehiculo) {
      return res.status(404).json({
        message: `No se encontró el vehículo con id ${id}`
      });
    }

    return res.status(200).json(vehiculo);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el vehículo',
      error: error.message
    });
  }
};

// Crear un nuevo vehículo (POST)
const createVehiculo = async (req, res) => {
  try {
    const {
      placa,
      categoria_id,
      sucursal_id,
      conductor_id,
      marca,
      modelo,
      anio,
      kilometraje_actual,
      numero_chasis_vin,
      estado
    } = req.body;

    if (!placa || !categoria_id || !sucursal_id || !marca || !modelo || !anio || !numero_chasis_vin) {
      return res.status(400).json({
        message: 'Los campos placa, categoria_id, sucursal_id, marca, modelo, anio y numero_chasis_vin son obligatorios'
      });
    }

    // Verificar unicidad de placa
    const placaExistente = await Vehiculo.findOne({ where: { placa } });
    if (placaExistente) {
      return res.status(400).json({
        message: `Ya existe un vehículo registrado con la placa ${placa}`
      });
    }

    // Verificar unicidad de VIN
    const vinExistente = await Vehiculo.findOne({ where: { numero_chasis_vin } });
    if (vinExistente) {
      return res.status(400).json({
        message: `Ya existe un vehículo con el número de chasis / VIN ${numero_chasis_vin}`
      });
    }

    // Verificar categoría
    const categoria = await CategoriaVehiculo.findByPk(categoria_id);
    if (!categoria) {
      return res.status(404).json({
        message: `No se encontró la categoría de vehículo con id ${categoria_id}`
      });
    }

    // Verificar sucursal
    const sucursal = await Sucursal.findByPk(sucursal_id);
    if (!sucursal) {
      return res.status(404).json({
        message: `No se encontró la sucursal con id ${sucursal_id}`
      });
    }

    // Verificar conductor si fue proporcionado
    if (conductor_id) {
      const conductor = await Conductor.findByPk(conductor_id);
      if (!conductor) {
        return res.status(404).json({
          message: `No se encontró el conductor con id ${conductor_id}`
        });
      }
    }

    const nuevoVehiculo = await Vehiculo.create({
      placa,
      categoria_id,
      sucursal_id,
      conductor_id: conductor_id || null,
      marca,
      modelo,
      anio,
      kilometraje_actual: kilometraje_actual !== undefined ? kilometraje_actual : 0,
      numero_chasis_vin,
      estado: estado || 'operativo'
    });

    return res.status(201).json({
      message: 'Vehículo registrado exitosamente',
      data: nuevoVehiculo
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar el vehículo',
      error: error.message
    });
  }
};

// Actualizar un vehículo existente (PUT)
const updateVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      placa,
      categoria_id,
      sucursal_id,
      conductor_id,
      marca,
      modelo,
      anio,
      kilometraje_actual,
      numero_chasis_vin,
      estado
    } = req.body;

    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({
        message: `No se encontró el vehículo con id ${id}`
      });
    }

    if (placa && placa !== vehiculo.placa) {
      const placaExistente = await Vehiculo.findOne({ where: { placa } });
      if (placaExistente) {
        return res.status(400).json({
          message: `La placa ${placa} ya está registrada en otro vehículo`
        });
      }
    }

    if (numero_chasis_vin && numero_chasis_vin !== vehiculo.numero_chasis_vin) {
      const vinExistente = await Vehiculo.findOne({ where: { numero_chasis_vin } });
      if (vinExistente) {
        return res.status(400).json({
          message: `El número de chasis / VIN ${numero_chasis_vin} ya está registrado en otro vehículo`
        });
      }
    }

    if (categoria_id && categoria_id !== vehiculo.categoria_id) {
      const categoria = await CategoriaVehiculo.findByPk(categoria_id);
      if (!categoria) {
        return res.status(404).json({
          message: `No se encontró la categoría de vehículo con id ${categoria_id}`
        });
      }
    }

    if (sucursal_id && sucursal_id !== vehiculo.sucursal_id) {
      const sucursal = await Sucursal.findByPk(sucursal_id);
      if (!sucursal) {
        return res.status(404).json({
          message: `No se encontró la sucursal con id ${sucursal_id}`
        });
      }
    }

    if (conductor_id !== undefined && conductor_id !== null && conductor_id !== vehiculo.conductor_id) {
      const conductor = await Conductor.findByPk(conductor_id);
      if (!conductor) {
        return res.status(404).json({
          message: `No se encontró el conductor con id ${conductor_id}`
        });
      }
    }

    await vehiculo.update({
      placa: placa !== undefined ? placa : vehiculo.placa,
      categoria_id: categoria_id !== undefined ? categoria_id : vehiculo.categoria_id,
      sucursal_id: sucursal_id !== undefined ? sucursal_id : vehiculo.sucursal_id,
      conductor_id: conductor_id !== undefined ? conductor_id : vehiculo.conductor_id,
      marca: marca !== undefined ? marca : vehiculo.marca,
      modelo: modelo !== undefined ? modelo : vehiculo.modelo,
      anio: anio !== undefined ? anio : vehiculo.anio,
      kilometraje_actual: kilometraje_actual !== undefined ? kilometraje_actual : vehiculo.kilometraje_actual,
      numero_chasis_vin: numero_chasis_vin !== undefined ? numero_chasis_vin : vehiculo.numero_chasis_vin,
      estado: estado !== undefined ? estado : vehiculo.estado
    });

    return res.status(200).json({
      message: 'Vehículo actualizado exitosamente',
      data: vehiculo
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el vehículo',
      error: error.message
    });
  }
};

// Eliminar un vehículo (DELETE)
const deleteVehiculo = async (req, res) => {
  try {
    const { id } = req.params;

    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({
        message: `No se encontró el vehículo con id ${id}`
      });
    }

    await vehiculo.destroy();

    return res.status(200).json({
      message: `Vehículo con id ${id} eliminado exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el vehículo',
      error: error.message
    });
  }
};

module.exports = {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
};

