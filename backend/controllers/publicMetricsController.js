const { Op } = require('sequelize');
const {
  Vehiculo,
  OrdenMantenimiento,
  AsignacionViaje,
  TallerProveedor,
  Sucursal,
  Conductor
} = require('../models');

const getPublicMetrics = async (req, res) => {
  try {
    const now = new Date();
    const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    const monthStart = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const nextMonthStart = formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 1));
    const [estadosVehiculos, ordenesAbiertas, costoMes, viajesEnCurso, talleres, sucursales, conductores] = await Promise.all([
      Vehiculo.findAll({ attributes: ['estado'], raw: true }),
      OrdenMantenimiento.count({
        where: {
          fecha_cierre: null,
          estado: { [Op.notIn]: ['completada', 'completado', 'cerrada', 'cerrado', 'cancelada', 'cancelado'] }
        }
      }),
      OrdenMantenimiento.sum('costo_total', {
        where: { fecha_apertura: { [Op.gte]: monthStart, [Op.lt]: nextMonthStart } }
      }),
      AsignacionViaje.count({ where: { estado: 'en_curso', fecha_retorno: null } }),
      TallerProveedor.count(),
      Sucursal.count(),
      Conductor.count()
    ]);
    const operativos = new Set(['operativo', 'activo', 'disponible']);

    return res.status(200).json({
      vehiculosTotal: estadosVehiculos.length,
      vehiculosActivos: estadosVehiculos.filter(({ estado }) => operativos.has(String(estado || '').toLowerCase())).length,
      ordenesAbiertas,
      costoMes: Number(costoMes || 0),
      viajesEnCurso,
      talleresTotal: talleres,
      sucursalesTotal: sucursales,
      conductoresTotal: conductores
    });
  } catch (error) {
    console.error('Error al calcular métricas públicas:', error);
    return res.status(500).json({ message: 'No se pudieron cargar las métricas.' });
  }
};

module.exports = { getPublicMetrics };
