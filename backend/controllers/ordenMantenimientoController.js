const { OrdenMantenimiento, Vehiculo, TallerProveedor, DetalleRepuestoOrden, CatalogoRepuesto } = require('../models');

// Obtener todas las órdenes de mantenimiento (GET)
const getAllOrdenesMantenimiento = async (req, res) => {
  try {
    const ordenes = await OrdenMantenimiento.findAll({
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: TallerProveedor, as: 'taller' },
        {
          model: DetalleRepuestoOrden,
          as: 'detalles_repuestos',
          include: [{ model: CatalogoRepuesto, as: 'repuesto' }]
        }
      ]
    });
    return res.status(200).json(ordenes);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las órdenes de mantenimiento',
      error: error.message
    });
  }
};

// Obtener una orden de mantenimiento por ID (GET)
const getOrdenMantenimientoById = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await OrdenMantenimiento.findByPk(id, {
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: TallerProveedor, as: 'taller' },
        {
          model: DetalleRepuestoOrden,
          as: 'detalles_repuestos',
          include: [{ model: CatalogoRepuesto, as: 'repuesto' }]
        }
      ]
    });

    if (!orden) {
      return res.status(404).json({
        message: `No se encontró la orden de mantenimiento con id ${id}`
      });
    }

    return res.status(200).json(orden);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la orden de mantenimiento',
      error: error.message
    });
  }
};

// Crear una nueva orden de mantenimiento (POST)
const createOrdenMantenimiento = async (req, res) => {
  try {
    const {
      vehiculo_id,
      taller_id,
      fecha_apertura,
      fecha_cierre,
      tipo_mantenimiento,
      km_registro,
      descripcion_problema,
      costo_mano_obra,
      costo_total,
      estado
    } = req.body;

    if (!vehiculo_id || !taller_id || !fecha_apertura || !tipo_mantenimiento || km_registro === undefined) {
      return res.status(400).json({
        message: 'Los campos vehiculo_id, taller_id, fecha_apertura, tipo_mantenimiento y km_registro son obligatorios'
      });
    }

    const vehiculo = await Vehiculo.findByPk(vehiculo_id);
    if (!vehiculo) {
      return res.status(404).json({
        message: `No se encontró el vehículo con id ${vehiculo_id}`
      });
    }

    const taller = await TallerProveedor.findByPk(taller_id);
    if (!taller) {
      return res.status(404).json({
        message: `No se encontró el taller proveedor con id ${taller_id}`
      });
    }

    const manoObra = costo_mano_obra !== undefined ? Number(costo_mano_obra) : 0.00;
    const total = costo_total !== undefined ? Number(costo_total) : manoObra;

    const nuevaOrden = await OrdenMantenimiento.create({
      vehiculo_id,
      taller_id,
      fecha_apertura,
      fecha_cierre: fecha_cierre || null,
      tipo_mantenimiento,
      km_registro,
      descripcion_problema,
      costo_mano_obra: manoObra,
      costo_total: total,
      estado: estado || 'abierta'
    });

    return res.status(201).json({
      message: 'Orden de mantenimiento creada exitosamente',
      data: nuevaOrden
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear la orden de mantenimiento',
      error: error.message
    });
  }
};

// Actualizar una orden de mantenimiento existente (PUT)
const updateOrdenMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehiculo_id,
      taller_id,
      fecha_apertura,
      fecha_cierre,
      tipo_mantenimiento,
      km_registro,
      descripcion_problema,
      costo_mano_obra,
      costo_total,
      estado
    } = req.body;

    const orden = await OrdenMantenimiento.findByPk(id);
    if (!orden) {
      return res.status(404).json({
        message: `No se encontró la orden de mantenimiento con id ${id}`
      });
    }

    if (vehiculo_id && vehiculo_id !== orden.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(vehiculo_id);
      if (!vehiculo) {
        return res.status(404).json({
          message: `No se encontró el vehículo con id ${vehiculo_id}`
        });
      }
    }

    if (taller_id && taller_id !== orden.taller_id) {
      const taller = await TallerProveedor.findByPk(taller_id);
      if (!taller) {
        return res.status(404).json({
          message: `No se encontró el taller proveedor con id ${taller_id}`
        });
      }
    }

    await orden.update({
      vehiculo_id: vehiculo_id !== undefined ? vehiculo_id : orden.vehiculo_id,
      taller_id: taller_id !== undefined ? taller_id : orden.taller_id,
      fecha_apertura: fecha_apertura !== undefined ? fecha_apertura : orden.fecha_apertura,
      fecha_cierre: fecha_cierre !== undefined ? fecha_cierre : orden.fecha_cierre,
      tipo_mantenimiento: tipo_mantenimiento !== undefined ? tipo_mantenimiento : orden.tipo_mantenimiento,
      km_registro: km_registro !== undefined ? km_registro : orden.km_registro,
      descripcion_problema: descripcion_problema !== undefined ? descripcion_problema : orden.descripcion_problema,
      costo_mano_obra: costo_mano_obra !== undefined ? costo_mano_obra : orden.costo_mano_obra,
      costo_total: costo_total !== undefined ? costo_total : orden.costo_total,
      estado: estado !== undefined ? estado : orden.estado
    });

    return res.status(200).json({
      message: 'Orden de mantenimiento actualizada exitosamente',
      data: orden
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la orden de mantenimiento',
      error: error.message
    });
  }
};

// Eliminar una orden de mantenimiento (DELETE)
const deleteOrdenMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;

    const orden = await OrdenMantenimiento.findByPk(id);
    if (!orden) {
      return res.status(404).json({
        message: `No se encontró la orden de mantenimiento con id ${id}`
      });
    }

    await orden.destroy();

    return res.status(200).json({
      message: `Orden de mantenimiento con id ${id} eliminada exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la orden de mantenimiento',
      error: error.message
    });
  }
};

module.exports = {
  getAllOrdenesMantenimiento,
  getOrdenMantenimientoById,
  createOrdenMantenimiento,
  updateOrdenMantenimiento,
  deleteOrdenMantenimiento
};

