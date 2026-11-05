const express = require('express');
const router = express.Router();
const {
  getAllInspeccionesPreViaje,
  getInspeccionPreViajeById,
  createInspeccionPreViaje,
  updateInspeccionPreViaje,
  deleteInspeccionPreViaje
} = require('../controllers/inspeccionPreViajeController');

router.get('/', getAllInspeccionesPreViaje);
router.get('/:id', getInspeccionPreViajeById);
router.post('/', createInspeccionPreViaje);
router.put('/:id', updateInspeccionPreViaje);
router.delete('/:id', deleteInspeccionPreViaje);

module.exports = router;

