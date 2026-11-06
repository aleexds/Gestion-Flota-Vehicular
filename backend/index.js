require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize } = require('./models');
const authRoutes = require('./endpoints/authRoutes');
const { authenticate } = require('./middleware/authenticate');
const { getPublicMetrics } = require('./controllers/publicMetricsController');
const { getMaintenancePlan } = require('./controllers/aiMaintenanceController');

// Importar rutas individuales desde la carpeta endpoints
const sucursalRoutes = require('./endpoints/sucursalRoutes');
const categoriaVehiculoRoutes = require('./endpoints/categoriaVehiculoRoutes');
const tallerProveedorRoutes = require('./endpoints/tallerProveedorRoutes');
const catalogoRepuestoRoutes = require('./endpoints/catalogoRepuestoRoutes');
const rutaRoutes = require('./endpoints/rutaRoutes');
const conductorRoutes = require('./endpoints/conductorRoutes');
const vehiculoRoutes = require('./endpoints/vehiculoRoutes');
const polizaSeguroRoutes = require('./endpoints/polizaSeguroRoutes');
const asignacionViajeRoutes = require('./endpoints/asignacionViajeRoutes');
const ordenMantenimientoRoutes = require('./endpoints/ordenMantenimientoRoutes');
const detalleRepuestoOrdenRoutes = require('./endpoints/detalleRepuestoOrdenRoutes');

// 9 Rutas Nuevas
const inventarioNeumaticoRoutes = require('./endpoints/inventarioNeumaticoRoutes');
const certificacionLicenciaRoutes = require('./endpoints/certificacionLicenciaRoutes');
const inspeccionPreViajeRoutes = require('./endpoints/inspeccionPreViajeRoutes');
const bitacoraEstadoVehiculoRoutes = require('./endpoints/bitacoraEstadoVehiculoRoutes');
const cargaCombustibleRoutes = require('./endpoints/cargaCombustibleRoutes');
const siniestroAccidenteRoutes = require('./endpoints/siniestroAccidenteRoutes');
const sancionMultaRoutes = require('./endpoints/sancionMultaRoutes');
const montajeNeumaticoRoutes = require('./endpoints/montajeNeumaticoRoutes');
const reclamacionSeguroRoutes = require('./endpoints/reclamacionSeguroRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para CORS, parsear JSON y datos de formularios
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Autenticación pública y métricas agregadas para la landing.
app.use('/api/auth', authRoutes);
app.get('/api/public/metrics', getPublicMetrics);

// Todas las rutas de negocio existentes requieren una sesión válida.
app.use('/api', authenticate);
app.post('/api/ai/maintenance-plan', getMaintenancePlan);

// Registrar todas las 20 rutas de la API en el servidor Express
app.use('/api/sucursales', sucursalRoutes);
app.use('/api/categorias-vehiculo', categoriaVehiculoRoutes);
app.use('/api/talleres-proveedores', tallerProveedorRoutes);
app.use('/api/catalogo-repuestos', catalogoRepuestoRoutes);
app.use('/api/rutas', rutaRoutes);
app.use('/api/conductores', conductorRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/polizas-seguro', polizaSeguroRoutes);
app.use('/api/asignaciones-viaje', asignacionViajeRoutes);
app.use('/api/ordenes-mantenimiento', ordenMantenimientoRoutes);
app.use('/api/detalles-repuestos-orden', detalleRepuestoOrdenRoutes);

// 9 Rutas Nuevas
app.use('/api/inventario-neumaticos', inventarioNeumaticoRoutes);
app.use('/api/certificaciones-licencias', certificacionLicenciaRoutes);
app.use('/api/inspecciones-pre-viaje', inspeccionPreViajeRoutes);
app.use('/api/bitacora-estado-vehiculo', bitacoraEstadoVehiculoRoutes);
app.use('/api/cargas-combustible', cargaCombustibleRoutes);
app.use('/api/siniestros-accidentes', siniestroAccidenteRoutes);
app.use('/api/sanciones-multas', sancionMultaRoutes);
app.use('/api/montaje-neumaticos', montajeNeumaticoRoutes);
app.use('/api/reclamaciones-seguro', reclamacionSeguroRoutes);

// ----------------------------------------------------------------
// Servir el frontend React (dist/) desde Express
// Funciona en produccion sin necesitar Vite corriendo por separado
// ----------------------------------------------------------------
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(FRONTEND_DIST));

// Ruta informativa de la API (solo si acceso directo al JSON)
app.get('/api', (req, res) => {
  res.json({
    message: 'API de Mantenimiento de Flota Vehicular (FleetOps)',
    status: 'online',
    total_endpoints: 20,
    endpoints: {
      sucursales: '/api/sucursales',
      categoriasVehiculo: '/api/categorias-vehiculo',
      talleresProveedores: '/api/talleres-proveedores',
      catalogoRepuestos: '/api/catalogo-repuestos',
      rutas: '/api/rutas',
      conductores: '/api/conductores',
      vehiculos: '/api/vehiculos',
      polizasSeguro: '/api/polizas-seguro',
      asignacionesViaje: '/api/asignaciones-viaje',
      ordenesMantenimiento: '/api/ordenes-mantenimiento',
      detallesRepuestosOrden: '/api/detalles-repuestos-orden',
      inventarioNeumaticos: '/api/inventario-neumaticos',
      certificacionesLicencias: '/api/certificaciones-licencias',
      inspeccionesPreViaje: '/api/inspecciones-pre-viaje',
      bitacoraEstadoVehiculo: '/api/bitacora-estado-vehiculo',
      cargasCombustible: '/api/cargas-combustible',
      siniestrosAccidentes: '/api/siniestros-accidentes',
      sancionesMultas: '/api/sanciones-multas',
      montajeNeumaticos: '/api/montaje-neumaticos',
      reclamacionesSeguro: '/api/reclamaciones-seguro'
    }
  });
});

// SPA fallback: cualquier ruta que no sea /api/* retorna el index.html de React
app.get(/.*/, (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
  }
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: err.message
  });
});

// Iniciar servidor y comprobar conexion con la base de datos
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Conexion a la base de datos establecida con exito.');
  } catch (error) {
    console.warn(' Advertencia: No se pudo conectar a la base de datos MySQL.');
    console.warn(` Detalle: ${error.message}`);
    console.warn(' Verifica tus credenciales en config/config.json y que el servicio de MySQL este iniciado.');
  }

  app.listen(PORT, () => {
    console.log(` Servidor FleetOps escuchando en http://localhost:${PORT}`);
    console.log(` Frontend React disponible en http://localhost:${PORT}`);
    console.log(' 20 Endpoints CRUD activos bajo /api:');
    console.log('   - /api/sucursales');
    console.log('   - /api/categorias-vehiculo');
    console.log('   - /api/talleres-proveedores');
    console.log('   - /api/catalogo-repuestos');
    console.log('   - /api/rutas');
    console.log('   - /api/conductores');
    console.log('   - /api/vehiculos');
    console.log('   - /api/polizas-seguro');
    console.log('   - /api/asignaciones-viaje');
    console.log('   - /api/ordenes-mantenimiento');
    console.log('   - /api/detalles-repuestos-orden');
    console.log('   - /api/inventario-neumaticos');
    console.log('   - /api/certificaciones-licencias');
    console.log('   - /api/inspecciones-pre-viaje');
    console.log('   - /api/bitacora-estado-vehiculo');
    console.log('   - /api/cargas-combustible');
    console.log('   - /api/siniestros-accidentes');
    console.log('   - /api/sanciones-multas');
    console.log('   - /api/montaje-neumaticos');
    console.log('   - /api/reclamaciones-seguro');
  });
};

startServer();

module.exports = app;
