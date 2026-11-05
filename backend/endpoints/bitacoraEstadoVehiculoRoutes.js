const express = require('express');
const router = express.Router();
const {
  getAllBitacoraEstadoVehiculo,
  getBitacoraEstadoVehiculoById,
  createBitacoraEstadoVehiculo,
  updateBitacoraEstadoVehiculo,
  deleteBitacoraEstadoVehiculo
} = require('../controllers/bitacoraEstadoVehiculoController');

router.get('/', getAllBitacoraEstadoVehiculo);
router.get('/:id', getBitacoraEstadoVehiculoById);
router.post('/', createBitacoraEstadoVehiculo);
router.put('/:id', updateBitacoraEstadoVehiculo);
router.delete('/:id', deleteBitacoraEstadoVehiculo);

module.exports = router;

