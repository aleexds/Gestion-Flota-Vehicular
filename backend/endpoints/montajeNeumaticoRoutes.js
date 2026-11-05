const express = require('express');
const router = express.Router();
const {
  getAllMontajesNeumaticos,
  getMontajeNeumaticoById,
  createMontajeNeumatico,
  updateMontajeNeumatico,
  deleteMontajeNeumatico
} = require('../controllers/montajeNeumaticoController');

router.get('/', getAllMontajesNeumaticos);
router.get('/:id', getMontajeNeumaticoById);
router.post('/', createMontajeNeumatico);
router.put('/:id', updateMontajeNeumatico);
router.delete('/:id', deleteMontajeNeumatico);

module.exports = router;

