const express = require('express');
const router = express.Router();
const {
  getAllOrdenesMantenimiento,
  getOrdenMantenimientoById,
  createOrdenMantenimiento,
  updateOrdenMantenimiento,
  deleteOrdenMantenimiento
} = require('../controllers/ordenMantenimientoController');

router.get('/', getAllOrdenesMantenimiento);
router.get('/:id', getOrdenMantenimientoById);
router.post('/', createOrdenMantenimiento);
router.put('/:id', updateOrdenMantenimiento);
router.delete('/:id', deleteOrdenMantenimiento);

module.exports = router;

