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
  Users,
  Circle,
  BookOpen,
  CheckSquare,
  FileText,
  Flame,
  AlertOctagon,
  Gavel,
  RotateCw,
  FileMinus,
  ClipboardList,
  Store,
  Navigation,
  Package,
  Sparkles,
  LoaderCircle,
  ShieldCheck
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { apiFetch } from '../utils/api';

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
  const [maintenancePlan, setMaintenancePlan] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const generateMaintenancePlan = async () => {
    setAiLoading(true);
    setAiError('');
    try {
      const response = await apiFetch('/api/ai/maintenance-plan', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No se pudo generar el análisis.');
      setMaintenancePlan(result);
    } catch (error) {
      setAiError(error.message || 'No se pudo conectar con el servicio de IA.');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        const [resVeh, resOrd, resRut, resSuc, resCond] = await Promise.all([
          apiFetch('/api/vehiculos').then(r => r.json()).catch(() => []),
          apiFetch('/api/ordenes-mantenimiento').then(r => r.json()).catch(() => []),
          apiFetch('/api/rutas').then(r => r.json()).catch(() => []),
          apiFetch('/api/sucursales').then(r => r.json()).catch(() => []),
          apiFetch('/api/conductores').then(r => r.json()).catch(() => [])
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
        console.error('Error cargando metricas:', e);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    loadOverviewData();
  }, []);

  const solutionModules = [
    {
      group: 'Mantenimiento & Costos de Taller',
      desc: 'Automatiza el seguimiento preventivo y el gasto acumulado por unidad para mitigar perdidas por fallas mecanicas.',
      items: [
        { key: 'ordenes-mantenimiento', label: 'Ordenes de Mantenimiento', icon: Wrench },
        { key: 'detalles-repuestos-orden', label: 'Repuestos por Orden (M:N)', icon: ClipboardList },
        { key: 'catalogo-repuestos', label: 'Catalogo de Repuestos', icon: Package },
        { key: 'talleres-proveedores', label: 'Talleres Mecanicos Externos', icon: Store }
      ]
    },
    {
      group: 'Flota & Unidades Comerciales',
      desc: 'Centraliza la trazabilidad de unidades, odometro, categorias tecnicas y sedes operativas.',
      items: [
        { key: 'vehiculos', label: 'Unidades Vehiculares', icon: Truck },
        { key: 'categorias-vehiculo', label: 'Categorias de Flota', icon: Layers },
        { key: 'sucursales', label: 'Bases y Sucursales', icon: Building2 },
        { key: 'conductores', label: 'Conductores y Licencias', icon: Users }
      ]
    },
    {
      group: 'Logistica, Rutas & Viajes',
      desc: 'Control de asignaciones dinamicas por viaje con odometro y trazabilidad de rutas comerciales.',
      items: [
        { key: 'asignaciones-viaje', label: 'Asignaciones de Viaje (M:N)', icon: Navigation },
        { key: 'rutas', label: 'Rutas de Transporte', icon: MapPin }
      ]
    },
    {
      group: 'Seguridad, Polizas & Siniestros',
      desc: 'Cobertura de polizas, gestion de siniestros y reclamaciones para cumplimiento normativo de seguros.',
      items: [
        { key: 'polizas-seguro', label: 'Polizas de Seguro', icon: ShieldAlert },
        { key: 'siniestros-accidentes', label: 'Siniestros y Accidentes', icon: AlertOctagon },
        { key: 'reclamaciones-seguro', label: 'Reclamaciones de Seguro (M:N)', icon: FileMinus }
      ]
    },
    {
      group: 'Neumaticos (Inventario & Montaje)',
      desc: 'Gestion de vida util de neumaticos: existencias, montaje por eje y desmonte en cada unidad de la flota.',
      items: [
        { key: 'inventario-neumaticos', label: 'Inventario de Neumaticos', icon: Circle },
        { key: 'montaje-neumaticos', label: 'Montaje de Neumaticos (M:N)', icon: RotateCw }
      ]
    },
    {
      group: 'Operaciones & Seguridad Vial',
      desc: 'Certificaciones, inspecciones pre-viaje, bitacoras, consumo de combustible y control de multas.',
      items: [
        { key: 'certificaciones-licencias', label: 'Certificaciones y Licencias', icon: BookOpen },
        { key: 'inspecciones-pre-viaje', label: 'Inspecciones Pre-Viaje', icon: CheckSquare },
        { key: 'bitacora-estado-vehiculo', label: 'Bitacora Estado Vehiculo', icon: FileText },
        { key: 'cargas-combustible', label: 'Cargas de Combustible', icon: Flame },
        { key: 'sanciones-multas', label: 'Sanciones y Multas', icon: Gavel }
      ]
    }
  ];

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-wrapper">
        <Topbar title="FleetOps - Plataforma de Control Logistico y de Flotas" />

        <main className="content-area">
          {/* Banner de Contexto: Problema y Solucion Empresarial */}
          <section className="problem-solution-banner">
            <div className="banner-badge">
              <AlertTriangle size={14} />
              <span>Solucion a Descontrol Operativo</span>
            </div>
            <h1 className="banner-title">
              Control Preventivo y Trazabilidad Total de Flotas
            </h1>
            <p className="banner-text">
              <strong>El Problema:</strong> Perdidas economicas criticas causadas por unidades paradas fuera de servicio,
              descontrol en costos de talleres mecanicos externos y desarticulacion entre conductores, bases y rutas.<br />
              <strong>Nuestra Solucion:</strong> FleetOps centraliza el ciclo de vida de cada unidad vehicular,
              controla el gasto acumulado en ordenes tecnicas preventivas y garantiza la trazabilidad operativa en tiempo real.
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
                <div className="kpi-label">Servicios Tecnicos</div>
                <div className="kpi-value">{stats.loading ? '...' : stats.ordenesCount}</div>
                <div className="kpi-hint">Ordenes de mantenimiento abiertas/historicas</div>
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
                <div className="kpi-hint">Control de inversion en refacciones y mano de obra</div>
              </div>
              <div className="kpi-icon">
                <DollarSign size={22} />
              </div>
            </div>

            <div className="kpi-card">
              <div>
                <div className="kpi-label">Bases & Logistica</div>
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

          <section className="ai-plan-panel" aria-labelledby="ai-plan-title">
            <div className="ai-plan-header">
              <div className="ai-plan-title-wrap">
                <div className="ai-plan-icon"><Sparkles size={20} /></div>
                <div>
                  <p className="ai-plan-eyebrow">AUTOMATIZACIÓN INTELIGENTE</p>
                  <h2 id="ai-plan-title">Prioridad de mantenimiento</h2>
                </div>
              </div>
              <button
                type="button"
                className="ai-plan-button"
                onClick={generateMaintenancePlan}
                disabled={aiLoading}
              >
                {aiLoading ? <LoaderCircle size={16} className="ai-spinner" /> : <Sparkles size={16} />}
                {aiLoading ? 'Analizando flota…' : maintenancePlan ? 'Actualizar análisis' : 'Generar plan con IA'}
              </button>
            </div>

            {!maintenancePlan && !aiLoading && !aiError && (
              <p className="ai-plan-empty">Analiza kilometrajes, intervalos y órdenes recientes para organizar las próximas acciones preventivas.</p>
            )}
            {aiLoading && <p className="ai-plan-status" role="status">Consultando historial de la flota y generando recomendaciones.</p>}
            {aiError && <p className="ai-plan-error" role="alert">{aiError}</p>}

            {maintenancePlan && (
              <div className="ai-plan-results" aria-live="polite">
                <div className="ai-plan-summary">
                  <p>{maintenancePlan.summary}</p>
                  <span><ShieldCheck size={14} /> Revisión humana recomendada</span>
                </div>
                {maintenancePlan.priorities.length > 0 ? (
                  <div className="ai-priority-list">
                    {maintenancePlan.priorities.map((item) => (
                      <article className="ai-priority-row" key={`${item.vehicleId}-${item.priority}`}>
                        <span className={`ai-priority-badge priority-${item.priority}`}>{item.priority}</span>
                        <div className="ai-priority-content">
                          <h3>{item.plate} · Unidad #{item.vehicleId}</h3>
                          <p>{item.reason}</p>
                          <strong>{item.action}</strong>
                        </div>
                        <Link className="ai-priority-link" to="/modulo/vehiculos" aria-label={`Ver flota para la unidad ${item.vehicleId}`}>
                          <ArrowRight size={17} />
                        </Link>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="ai-plan-empty">No se identificaron unidades que requieran una prioridad específica con los datos actuales.</p>
                )}
                <time className="ai-plan-time" dateTime={maintenancePlan.generatedAt}>
                  Análisis generado {new Date(maintenancePlan.generatedAt).toLocaleString('es-CR')}
                </time>
              </div>
            )}
          </section>

          {/* Bloques de Modulos CRUD */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Modulos del Sistema (CRUD de 20 Tablas)
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
