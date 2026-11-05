const express = require('express');
const router = express.Router();
const {
  getAllSancionesMultas,
  getSancionMultaById,
  createSancionMulta,
  updateSancionMulta,
  deleteSancionMulta
} = require('../controllers/sancionMultaController');

router.get('/', getAllSancionesMultas);
router.get('/:id', getSancionMultaById);
router.post('/', createSancionMulta);
router.put('/:id', updateSancionMulta);
router.delete('/:id', deleteSancionMulta);

module.exports = router;

