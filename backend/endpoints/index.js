const express = require('express');
const router = express.Router();

const sucursalRoutes = require('./sucursalRoutes');

// Rutas de la API
router.use('/sucursales', sucursalRoutes);

module.exports = router;

