const express = require('express');
const router = express.Router();
const {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} = require('../controllers/vehiculoController');

router.get('/', getAllVehiculos);
router.get('/:id', getVehiculoById);
router.post('/', createVehiculo);
router.put('/:id', updateVehiculo);
router.delete('/:id', deleteVehiculo);

module.exports = router;

