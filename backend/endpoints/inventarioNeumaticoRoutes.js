const express = require('express');
const router = express.Router();
const {
  getAllInventarioNeumaticos,
  getInventarioNeumaticoById,
  createInventarioNeumatico,
  updateInventarioNeumatico,
  deleteInventarioNeumatico
} = require('../controllers/inventarioNeumaticoController');

router.get('/', getAllInventarioNeumaticos);
router.get('/:id', getInventarioNeumaticoById);
router.post('/', createInventarioNeumatico);
router.put('/:id', updateInventarioNeumatico);
router.delete('/:id', deleteInventarioNeumatico);

module.exports = router;

