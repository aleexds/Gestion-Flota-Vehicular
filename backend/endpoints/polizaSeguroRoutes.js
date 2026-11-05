const express = require('express');
const router = express.Router();
const {
  getAllPolizasSeguro,
  getPolizaSeguroById,
  createPolizaSeguro,
  updatePolizaSeguro,
  deletePolizaSeguro
} = require('../controllers/polizaSeguroController');

router.get('/', getAllPolizasSeguro);
router.get('/:id', getPolizaSeguroById);
router.post('/', createPolizaSeguro);
router.put('/:id', updatePolizaSeguro);
router.delete('/:id', deletePolizaSeguro);

module.exports = router;

