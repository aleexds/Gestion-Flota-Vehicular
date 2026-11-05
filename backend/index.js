require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const apiRoutes = require('./endpoints');

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

// Ruta inicial de bienvenida y verificación de estado con mapa de endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'API de Mantenimiento de Flota Vehicular (FleetOps)',
    status: 'online',
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
      detallesRepuestosOrden: '/api/detalles-repuestos-orden'
    }
  });
});

// Registrar rutas bajo el prefijo /api
app.use('/api', apiRoutes);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: err.message
  });
});

// Iniciar servidor y comprobar conexión con la base de datos
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Conexión a la base de datos establecida con éxito.');
  } catch (error) {
    console.warn(' Advertencia: No se pudo conectar a la base de datos MySQL.');
    console.warn(` Detalle: ${error.message}`);
    console.warn(' Verifica tus credenciales en config/config.json y que el servicio de MySQL esté iniciado.');
  }

  app.listen(PORT, () => {
    console.log(` Servidor Express escuchando en http://localhost:${PORT}`);
    console.log(` Endpoints disponibles bajo el prefijo http://localhost:${PORT}/api`);
  });
};

startServer();

module.exports = app;
