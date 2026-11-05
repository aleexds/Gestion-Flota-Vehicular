const express = require('express');
const router = express.Router();
const {
  getAllReclamacionesSeguro,
  getReclamacionSeguroById,
  createReclamacionSeguro,
  updateReclamacionSeguro,
  deleteReclamacionSeguro
} = require('../controllers/reclamacionSeguroController');

router.get('/', getAllReclamacionesSeguro);
router.get('/:id', getReclamacionSeguroById);
router.post('/', createReclamacionSeguro);
router.put('/:id', updateReclamacionSeguro);
router.delete('/:id', deleteReclamacionSeguro);

module.exports = router;

