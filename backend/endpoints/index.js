const express = require('express');
const router = express.Router();

// Importar rutas de cada entidad
const sucursalRoutes = require('./sucursalRoutes');
const categoriaVehiculoRoutes = require('./categoriaVehiculoRoutes');
const tallerProveedorRoutes = require('./tallerProveedorRoutes');
const catalogoRepuestoRoutes = require('./catalogoRepuestoRoutes');
const rutaRoutes = require('./rutaRoutes');
const conductorRoutes = require('./conductorRoutes');
const vehiculoRoutes = require('./vehiculoRoutes');
const polizaSeguroRoutes = require('./polizaSeguroRoutes');
const asignacionViajeRoutes = require('./asignacionViajeRoutes');
const ordenMantenimientoRoutes = require('./ordenMantenimientoRoutes');
const detalleRepuestoOrdenRoutes = require('./detalleRepuestoOrdenRoutes');

// Montaje de rutas de la API
router.use('/sucursales', sucursalRoutes);
router.use('/categorias-vehiculo', categoriaVehiculoRoutes);
router.use('/talleres-proveedores', tallerProveedorRoutes);
router.use('/catalogo-repuestos', catalogoRepuestoRoutes);
router.use('/rutas', rutaRoutes);
router.use('/conductores', conductorRoutes);
router.use('/vehiculos', vehiculoRoutes);
router.use('/polizas-seguro', polizaSeguroRoutes);
router.use('/asignaciones-viaje', asignacionViajeRoutes);
router.use('/ordenes-mantenimiento', ordenMantenimientoRoutes);
router.use('/detalles-repuestos-orden', detalleRepuestoOrdenRoutes);

module.exports = router;
