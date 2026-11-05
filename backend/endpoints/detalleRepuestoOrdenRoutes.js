const express = require('express');
const router = express.Router();
const {
  getAllDetallesRepuestosOrden,
  getDetalleRepuestoOrdenById,
  createDetalleRepuestoOrden,
  updateDetalleRepuestoOrden,
  deleteDetalleRepuestoOrden
} = require('../controllers/detalleRepuestoOrdenController');

router.get('/', getAllDetallesRepuestosOrden);
router.get('/:id', getDetalleRepuestoOrdenById);
router.post('/', createDetalleRepuestoOrden);
router.put('/:id', updateDetalleRepuestoOrden);
router.delete('/:id', deleteDetalleRepuestoOrden);

module.exports = router;

