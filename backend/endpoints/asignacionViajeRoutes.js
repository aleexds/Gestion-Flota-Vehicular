const express = require('express');
const router = express.Router();
const {
  getAllAsignacionesViaje,
  getAsignacionViajeById,
  createAsignacionViaje,
  updateAsignacionViaje,
  deleteAsignacionViaje
} = require('../controllers/asignacionViajeController');

router.get('/', getAllAsignacionesViaje);
router.get('/:id', getAsignacionViajeById);
router.post('/', createAsignacionViaje);
router.put('/:id', updateAsignacionViaje);
router.delete('/:id', deleteAsignacionViaje);

module.exports = router;

