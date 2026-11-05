const { DetalleRepuestoOrden, OrdenMantenimiento, CatalogoRepuesto } = require('../models');

// Función auxiliar para recalcular el costo total de la orden
const recalcularCostoOrden = async (ordenId) => {
  try {
    const orden = await OrdenMantenimiento.findByPk(ordenId);
    if (!orden) return;

    const detalles = await DetalleRepuestoOrden.findAll({ where: { orden_id: ordenId } });
    const totalRepuestos = detalles.reduce((acc, curr) => acc + Number(curr.subtotal || 0), 0);
    const nuevoTotal = Number(orden.costo_mano_obra || 0) + totalRepuestos;

    await orden.update({ costo_total: nuevoTotal });
  } catch (error) {
    console.error('Error al recalcular costo total de la orden:', error.message);
  }
};

// Obtener todos los detalles de repuestos (GET)
const getAllDetallesRepuestosOrden = async (req, res) => {
  try {
    const { orden_id } = req.query;
    const where = orden_id ? { orden_id } : {};

    const detalles = await DetalleRepuestoOrden.findAll({
      where,
      include: [
        { model: OrdenMantenimiento, as: 'orden' },
        { model: CatalogoRepuesto, as: 'repuesto' }
      ]
    });
    return res.status(200).json(detalles);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los detalles de repuestos de órdenes',
      error: error.message
    });
  }
};

// Obtener un detalle de repuesto por ID (GET)
const getDetalleRepuestoOrdenById = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await DetalleRepuestoOrden.findByPk(id, {
      include: [
        { model: OrdenMantenimiento, as: 'orden' },
        { model: CatalogoRepuesto, as: 'repuesto' }
      ]
    });

    if (!detalle) {
      return res.status(404).json({
        message: `No se encontró el detalle de repuesto con id ${id}`
      });
    }

    return res.status(200).json(detalle);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el detalle de repuesto',
      error: error.message
    });
  }
};

// Crear un nuevo detalle de repuesto en una orden (POST)
const createDetalleRepuestoOrden = async (req, res) => {
  try {
    const { orden_id, repuesto_id, cantidad, precio_unitario, subtotal } = req.body;

    if (!orden_id || !repuesto_id || cantidad === undefined) {
      return res.status(400).json({
        message: 'Los campos orden_id, repuesto_id y cantidad son obligatorios'
      });
    }

    const orden = await OrdenMantenimiento.findByPk(orden_id);
    if (!orden) {
      return res.status(404).json({
        message: `No se encontró la orden de mantenimiento con id ${orden_id}`
      });
    }

    const repuesto = await CatalogoRepuesto.findByPk(repuesto_id);
    if (!repuesto) {
      return res.status(404).json({
        message: `No se encontró el repuesto en el catálogo con id ${repuesto_id}`
      });
    }

    const cant = Number(cantidad);
    const precio = precio_unitario !== undefined ? Number(precio_unitario) : Number(repuesto.precio_referencia || 0);
    const sub = subtotal !== undefined ? Number(subtotal) : cant * precio;

    const nuevoDetalle = await DetalleRepuestoOrden.create({
      orden_id,
      repuesto_id,
      cantidad: cant,
      precio_unitario: precio,
      subtotal: sub
    });

    // Actualizar costo_total acumulado en la orden
    await recalcularCostoOrden(orden_id);

    return res.status(201).json({
      message: 'Repuesto agregado a la orden exitosamente',
      data: nuevoDetalle
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al agregar el repuesto a la orden',
      error: error.message
    });
  }
};

// Actualizar un detalle de repuesto existente (PUT)
const updateDetalleRepuestoOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { orden_id, repuesto_id, cantidad, precio_unitario, subtotal } = req.body;

    const detalle = await DetalleRepuestoOrden.findByPk(id);
    if (!detalle) {
      return res.status(404).json({
        message: `No se encontró el detalle de repuesto con id ${id}`
      });
    }

    const ordenIdFinal = orden_id !== undefined ? orden_id : detalle.orden_id;
    const repuestoIdFinal = repuesto_id !== undefined ? repuesto_id : detalle.repuesto_id;

    if (orden_id && orden_id !== detalle.orden_id) {
      const orden = await OrdenMantenimiento.findByPk(orden_id);
      if (!orden) {
        return res.status(404).json({
          message: `No se encontró la orden de mantenimiento con id ${orden_id}`
        });
      }
    }

    if (repuesto_id && repuesto_id !== detalle.repuesto_id) {
      const repuesto = await CatalogoRepuesto.findByPk(repuesto_id);
      if (!repuesto) {
        return res.status(404).json({
          message: `No se encontró el repuesto con id ${repuesto_id}`
        });
      }
    }

    const cantFinal = cantidad !== undefined ? Number(cantidad) : detalle.cantidad;
    const precioFinal = precio_unitario !== undefined ? Number(precio_unitario) : detalle.precio_unitario;
    const subtotalFinal = subtotal !== undefined ? Number(subtotal) : cantFinal * precioFinal;

    await detalle.update({
      orden_id: ordenIdFinal,
      repuesto_id: repuestoIdFinal,
      cantidad: cantFinal,
      precio_unitario: precioFinal,
      subtotal: subtotalFinal
    });

    // Recalcular costo total en la orden
    await recalcularCostoOrden(ordenIdFinal);
    if (orden_id && orden_id !== detalle.orden_id) {
      await recalcularCostoOrden(detalle.orden_id);
    }

    return res.status(200).json({
      message: 'Detalle de repuesto actualizado exitosamente',
      data: detalle
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el detalle de repuesto',
      error: error.message
    });
  }
};

// Eliminar un detalle de repuesto (DELETE)
const deleteDetalleRepuestoOrden = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await DetalleRepuestoOrden.findByPk(id);
    if (!detalle) {
      return res.status(404).json({
        message: `No se encontró el detalle de repuesto con id ${id}`
      });
    }

    const ordenId = detalle.orden_id;
    await detalle.destroy();

    // Recalcular costo total en la orden
    await recalcularCostoOrden(ordenId);

    return res.status(200).json({
      message: `Detalle de repuesto con id ${id} eliminado exitosamente`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el detalle de repuesto',
      error: error.message
    });
  }
};

module.exports = {
  getAllDetallesRepuestosOrden,
  getDetalleRepuestoOrdenById,
  createDetalleRepuestoOrden,
  updateDetalleRepuestoOrden,
  deleteDetalleRepuestoOrden
};

