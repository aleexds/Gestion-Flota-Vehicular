const express = require('express');
const router = express.Router();
const {
  getAllTalleresProveedores,
  getTallerProveedorById,
  createTallerProveedor,
  updateTallerProveedor,
  deleteTallerProveedor
} = require('../controllers/tallerProveedorController');

router.get('/', getAllTalleresProveedores);
router.get('/:id', getTallerProveedorById);
router.post('/', createTallerProveedor);
router.put('/:id', updateTallerProveedor);
router.delete('/:id', deleteTallerProveedor);

module.exports = router;

