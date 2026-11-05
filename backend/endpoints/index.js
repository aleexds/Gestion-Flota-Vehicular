const express = require('express');
const router = express.Router();

// Importar rutas de las 20 entidades del sistema
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

// 9 Rutas Nuevas
const inventarioNeumaticoRoutes = require('./inventarioNeumaticoRoutes');
const certificacionLicenciaRoutes = require('./certificacionLicenciaRoutes');
const inspeccionPreViajeRoutes = require('./inspeccionPreViajeRoutes');
const bitacoraEstadoVehiculoRoutes = require('./bitacoraEstadoVehiculoRoutes');
const cargaCombustibleRoutes = require('./cargaCombustibleRoutes');
const siniestroAccidenteRoutes = require('./siniestroAccidenteRoutes');
const sancionMultaRoutes = require('./sancionMultaRoutes');
const montajeNeumaticoRoutes = require('./montajeNeumaticoRoutes');
const reclamacionSeguroRoutes = require('./reclamacionSeguroRoutes');

// Montaje de rutas de la API bajo /api
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

// 9 Rutas Nuevas
router.use('/inventario-neumaticos', inventarioNeumaticoRoutes);
router.use('/certificaciones-licencias', certificacionLicenciaRoutes);
router.use('/inspecciones-pre-viaje', inspeccionPreViajeRoutes);
router.use('/bitacora-estado-vehiculo', bitacoraEstadoVehiculoRoutes);
router.use('/cargas-combustible', cargaCombustibleRoutes);
router.use('/siniestros-accidentes', siniestroAccidenteRoutes);
router.use('/sanciones-multas', sancionMultaRoutes);
router.use('/montaje-neumaticos', montajeNeumaticoRoutes);
router.use('/reclamaciones-seguro', reclamacionSeguroRoutes);

module.exports = router;
