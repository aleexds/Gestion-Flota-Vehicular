const express = require('express');
const router = express.Router();
const {
  getAllSiniestrosAccidentes,
  getSiniestroAccidenteById,
  createSiniestroAccidente,
  updateSiniestroAccidente,
  deleteSiniestroAccidente
} = require('../controllers/siniestroAccidenteController');

router.get('/', getAllSiniestrosAccidentes);
router.get('/:id', getSiniestroAccidenteById);
router.post('/', createSiniestroAccidente);
router.put('/:id', updateSiniestroAccidente);
router.delete('/:id', deleteSiniestroAccidente);

module.exports = router;

