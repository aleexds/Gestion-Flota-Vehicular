const express = require('express');
const router = express.Router();
const {
  getAllConductores,
  getConductorById,
  createConductor,
  updateConductor,
  deleteConductor
} = require('../controllers/conductorController');

router.get('/', getAllConductores);
router.get('/:id', getConductorById);
router.post('/', createConductor);
router.put('/:id', updateConductor);
router.delete('/:id', deleteConductor);

module.exports = router;

