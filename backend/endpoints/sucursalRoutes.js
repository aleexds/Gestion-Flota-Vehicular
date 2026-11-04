const express = require('express');
const router = express.Router();
const {
  getAllSucursales,
  getSucursalById,
  createSucursal,
  updateSucursal,
  deleteSucursal
} = require('../controllers/sucursalController');

// Rutas para la entidad Sucursal

// GET / - Obtener todas las sucursales
router.get('/', getAllSucursales);

// GET /:id - Obtener una sucursal por su ID
router.get('/:id', getSucursalById);

// POST / - Crear una nueva sucursal
router.post('/', createSucursal);

// PUT /:id - Actualizar una sucursal por su ID
router.put('/:id', updateSucursal);

// DELETE /:id - Eliminar una sucursal por su ID
router.delete('/:id', deleteSucursal);

module.exports = router;

