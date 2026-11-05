const express = require('express');
const router = express.Router();
const {
  getAllCatalogoRepuestos,
  getCatalogoRepuestoById,
  createCatalogoRepuesto,
  updateCatalogoRepuesto,
  deleteCatalogoRepuesto
} = require('../controllers/catalogoRepuestoController');

router.get('/', getAllCatalogoRepuestos);
router.get('/:id', getCatalogoRepuestoById);
router.post('/', createCatalogoRepuesto);
router.put('/:id', updateCatalogoRepuesto);
router.delete('/:id', deleteCatalogoRepuesto);

module.exports = router;

