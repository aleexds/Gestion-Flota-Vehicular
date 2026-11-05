import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Wrench, 
  DollarSign, 
  MapPin, 
  Building2, 
  ShieldAlert, 
  ArrowRight, 
  AlertTriangle, 
  Layers,
  Users
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function HomePage() {
  const [stats, setStats] = useState({
    vehiculosCount: 0,
    ordenesCount: 0,
    costoTotalMantenimiento: 0,
    rutasCount: 0,
    sucursalesCount: 0,
    conductoresCount: 0,
    loading: true
  });

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        const [resVeh, resOrd, resRut, resSuc, resCond] = await Promise.all([
          fetch('/api/vehiculos').then(r => r.json()).catch(() => []),
          fetch('/api/ordenes-mantenimiento').then(r => r.json()).catch(() => []),
          fetch('/api/rutas').then(r => r.json()).catch(() => []),
          fetch('/api/sucursales').then(r => r.json()).catch(() => []),
          fetch('/api/conductores').then(r => r.json()).catch(() => [])
        ]);

        const vehiculos = Array.isArray(resVeh) ? resVeh : [];
        const ordenes = Array.isArray(resOrd) ? resOrd : [];
        const rutas = Array.isArray(resRut) ? resRut : [];
        const sucursales = Array.isArray(resSuc) ? resSuc : [];
        const conductores = Array.isArray(resCond) ? resCond : [];

        const totalGasto = ordenes.reduce((acc, o) => acc + Number(o.costo_total || 0), 0);

        setStats({
          vehiculosCount: vehiculos.length,
          ordenesCount: ordenes.length,
          costoTotalMantenimiento: totalGasto,
          rutasCount: rutas.length,
          sucursalesCount: sucursales.length,
          conductoresCount: conductores.length,
          loading: false
        });
      } catch (e) {
        console.error('Error cargando métricas:', e);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    loadOverviewData();
  }, []);

  const solutionModules = [
    {
      group: 'Mantenimiento & Costos de Taller',
      desc: 'Automatiza el seguimiento preventivo y el gasto acumulado por unidad para mitigar pérdidas por fallas mecánicas.',
      items: [
        { key: 'ordenes-mantenimiento', label: 'Órdenes de Mantenimiento', icon: Wrench },
        { key: 'detalles-repuestos-orden', label: 'Repuestos por Orden (M:N)', icon: Layers },
        { key: 'catalogo-repuestos', label: 'Catálogo de Repuestos', icon: Layers },
        { key: 'talleres-proveedores', label: 'Talleres Mecánicos Externos', icon: Building2 }
      ]
    },
    {
      group: 'Flota & Unidades Comerciales',
      desc: 'Centraliza la trazabilidad de unidades, odómetro, categorías técnicas y sedes operativas.',
      items: [
        { key: 'vehiculos', label: 'Unidades Vehiculares', icon: Truck },
        { key: 'categorias-vehiculo', label: 'Categorías de Flota', icon: Layers },
        { key: 'sucursales', label: 'Bases y Sucursales', icon: Building2 },
        { key: 'conductores', label: 'Conductores y Licencias', icon: Users }
      ]
    },
    {
      group: 'Logística, Rutas & Seguros',
      desc: 'Control de asignaciones dinámicas por viaje y cobertura de pólizas para cumplimiento normativo.',
      items: [
        { key: 'asignaciones-viaje', label: 'Asignaciones de Viaje (M:N)', icon: MapPin },
        { key: 'rutas', label: 'Rutas de Transporte', icon: MapPin },
        { key: 'polizas-seguro', label: 'Pólizas de Seguro', icon: ShieldAlert }
      ]
    }
  ];

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-wrapper">
        <Topbar title="FleetOps - Plataforma de Control Logístico y de Flotas" />

        <main className="content-area">
          {/* Banner de Contexto: Problema y Solución Empresarial */}
          <section className="problem-solution-banner">
            <div className="banner-badge">
              <AlertTriangle size={14} />
              <span>Solución a Descontrol Operativo</span>
            </div>
            <h1 className="banner-title">
              Control Preventivo y Trazabilidad Total de Flotas
            </h1>
            <p className="banner-text">
              <strong>El Problema:</strong> Pérdidas económicas críticas causadas por unidades paradas fuera de servicio,
              descontrol en costos de talleres mecánicos externos y desarticulación entre conductores, bases y rutas.<br />
              <strong>Nuestra Solución:</strong> FleetOps centraliza el ciclo de vida de cada unidad vehicular, 
              controla el gasto acumulado en órdenes técnicas preventivas y garantiza la trazabilidad operativa en tiempo real.
            </p>
          </section>

          {/* Tarjetas KPI en Tiempo Real */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div>
                <div className="kpi-label">Flota Vehicular</div>
                <div className="kpi-value">{stats.loading ? '...' : stats.vehiculosCount}</div>
                <div className="kpi-hint">Unidades comerciales registradas</div>
              </div>
              <div className="kpi-icon">
                <Truck size={22} />
              </div>
            </div>

            <div className="kpi-card">
              <div>
                <div className="kpi-label">Servicios Técnicos</div>
                <div className="kpi-value">{stats.loading ? '...' : stats.ordenesCount}</div>
                <div className="kpi-hint">Órdenes de mantenimiento abiertas/históricas</div>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                <Wrench size={22} />
              </div>
            </div>

            <div className="kpi-card">
              <div>
                <div className="kpi-label">Gasto Acumulado en Taller</div>
                <div className="kpi-value" style={{ color: 'var(--primary)' }}>
                  {stats.loading ? '...' : `$${stats.costoTotalMantenimiento.toLocaleString()}`}
                </div>
                <div className="kpi-hint">Control de inversión en refacciones y mano de obra</div>
              </div>
              <div className="kpi-icon">
                <DollarSign size={22} />
              </div>
            </div>

            <div className="kpi-card">
              <div>
                <div className="kpi-label">Bases & Logística</div>
                <div className="kpi-value">
                  {stats.loading ? '...' : `${stats.sucursalesCount} bases / ${stats.rutasCount} rutas`}
                </div>
                <div className="kpi-hint">{stats.conductoresCount} conductores habilitados</div>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                <MapPin size={22} />
              </div>
            </div>
          </div>

          {/* Bloques de Módulos CRUD */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Módulos del Sistema (CRUD de 11 Tablas)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {solutionModules.map((mod, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    {mod.group}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                    {mod.desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {mod.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.key}
                          to={`/modulo/${item.key}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.65rem 0.85rem',
                            backgroundColor: '#fafafa',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            textDecoration: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Icon size={16} color="var(--primary)" />
                            <span>{item.label}</span>
                          </div>
                          <ArrowRight size={14} color="var(--text-muted)" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
