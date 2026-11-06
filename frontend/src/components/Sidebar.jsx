import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Truck,
  LayoutDashboard,
  Wrench,
  Package,
  Building2,
  Layers,
  Users,
  MapPin,
  Navigation,
  ShieldCheck,
  ClipboardList,
  Store,
  Circle,
  BookOpen,
  CheckSquare,
  FileText,
  Flame,
  AlertOctagon,
  Gavel,
  RotateCw,
  FileMinus
} from 'lucide-react';
import { ENTITIES } from '../config/entitiesConfig';

const iconMap = {
  'ordenes-mantenimiento': Wrench,
  'detalles-repuestos-orden': ClipboardList,
  'catalogo-repuestos': Package,
  'talleres-proveedores': Store,
  'vehiculos': Truck,
  'categorias-vehiculo': Layers,
  'sucursales': Building2,
  'conductores': Users,
  'rutas': MapPin,
  'asignaciones-viaje': Navigation,
  'polizas-seguro': ShieldCheck,
  'inventario-neumaticos': Circle,
  'certificaciones-licencias': BookOpen,
  'inspecciones-pre-viaje': CheckSquare,
  'bitacora-estado-vehiculo': FileText,
  'cargas-combustible': Flame,
  'siniestros-accidentes': AlertOctagon,
  'sanciones-multas': Gavel,
  'montaje-neumaticos': RotateCw,
  'reclamaciones-seguro': FileMinus
};

export default function Sidebar() {
  const categories = [
    {
      title: 'Mantenimiento & Costos',
      items: ['ordenes-mantenimiento', 'detalles-repuestos-orden', 'catalogo-repuestos', 'talleres-proveedores']
    },
    {
      title: 'Flota & Unidades',
      items: ['vehiculos', 'categorias-vehiculo', 'sucursales', 'conductores']
    },
    {
      title: 'Logistica & Rutas',
      items: ['rutas', 'asignaciones-viaje']
    },
    {
      title: 'Seguridad & Polizas',
      items: ['polizas-seguro', 'siniestros-accidentes', 'reclamaciones-seguro']
    },
    {
      title: 'Neumaticos',
      items: ['inventario-neumaticos', 'montaje-neumaticos']
    },
    {
      title: 'Operaciones Viales',
      items: ['certificaciones-licencias', 'inspecciones-pre-viaje', 'bitacora-estado-vehiculo', 'cargas-combustible', 'sanciones-multas']
    }
  ];

  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="sidebar-brand">
        <div className="sidebar-logo">
          <Truck size={22} />
        </div>
        <div>
          <div className="sidebar-brand-title">FleetOps</div>
          <span className="sidebar-brand-badge">Control de Flota</span>
        </div>
      </NavLink>

      <div className="sidebar-menu">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={17} />
          <span>Panel de Control</span>
        </NavLink>

        {categories.map((cat, idx) => (
          <div key={idx} style={{ marginTop: '0.75rem' }}>
            <div className="sidebar-group-title">{cat.title}</div>
            {cat.items.map((itemKey) => {
              const entity = ENTITIES[itemKey];
              if (!entity) return null;
              const IconComponent = iconMap[itemKey] || Truck;
              return (
                <NavLink
                  key={itemKey}
                  to={`/modulo/${itemKey}`}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  title={entity.description}
                >
                  <IconComponent size={16} />
                  <span>{entity.plural}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div>Base de Datos: <strong>MySQL</strong></div>
        <div style={{ color: '#71717a', fontSize: '0.7rem', marginTop: '0.2rem' }}>
          20 Tablas Sincronizadas
        </div>
      </div>
    </aside>
  );
}
