const express = require('express');
const router = express.Router();
const {
  getAllCategoriasVehiculo,
  getCategoriaVehiculoById,
  createCategoriaVehiculo,
  updateCategoriaVehiculo,
  deleteCategoriaVehiculo
} = require('../controllers/categoriaVehiculoController');

router.get('/', getAllCategoriasVehiculo);
router.get('/:id', getCategoriaVehiculoById);
router.post('/', createCategoriaVehiculo);
router.put('/:id', updateCategoriaVehiculo);
router.delete('/:id', deleteCategoriaVehiculo);

module.exports = router;

