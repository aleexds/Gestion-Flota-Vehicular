const express = require('express');
const router = express.Router();
const {
  getAllRutas,
  getRutaById,
  createRuta,
  updateRuta,
  deleteRuta
} = require('../controllers/rutaController');

router.get('/', getAllRutas);
router.get('/:id', getRutaById);
router.post('/', createRuta);
router.put('/:id', updateRuta);
router.delete('/:id', deleteRuta);

module.exports = router;

