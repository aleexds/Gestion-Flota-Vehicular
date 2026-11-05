const express = require('express');
const router = express.Router();
const {
  getAllCargasCombustible,
  getCargaCombustibleById,
  createCargaCombustible,
  updateCargaCombustible,
  deleteCargaCombustible
} = require('../controllers/cargaCombustibleController');

router.get('/', getAllCargasCombustible);
router.get('/:id', getCargaCombustibleById);
router.post('/', createCargaCombustible);
router.put('/:id', updateCargaCombustible);
router.delete('/:id', deleteCargaCombustible);

module.exports = router;

