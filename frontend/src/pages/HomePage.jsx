import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Building2, Users, Wrench, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const modules = [
    {
      title: 'Bases y Sucursales',
      description: 'Centros de distribución y estacionamiento de unidades comerciales.',
      icon: <Building2 size={24} color="#2563eb" />,
      link: '/sucursales',
      active: true,
      badge: 'CRUD Operativo'
    },
    {
      title: 'Unidades Vehiculares',
      description: 'Control de placas, kilometraje acumulado, estados y modelos de flota.',
      icon: <Truck size={24} color="#64748b" />,
      link: '#',
      active: false,
      badge: 'Próximamente'
    },
    {
      title: 'Conductores',
      description: 'Gestión de licencias, tipos autorizados y asignación a unidades.',
      icon: <Users size={24} color="#64748b" />,
      link: '#',
      active: false,
      badge: 'Próximamente'
    },
    {
      title: 'Talleres y Mantenimiento',
      description: 'Órdenes de servicio técnico, repuestos y control de gasto acumulado.',
      icon: <Wrench size={24} color="#64748b" />,
      link: '#',
      active: false,
      badge: 'Próximamente'
    }
  ];

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <div style={{ marginBottom: '2.5rem' }}>
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              background: '#eff6ff', 
              color: '#2563eb', 
              padding: '0.35rem 0.75rem', 
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}
          >
            <Activity size={14} />
            <span>Sistema de Control y Trazabilidad de Flotas</span>
          </div>

          <h1 className="page-title" style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
            Bienvenido a FleetOps
          </h1>
          <p className="page-subtitle" style={{ maxWidth: '780px', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Plataforma centralizada para optimizar la logística, automatizar el seguimiento de 
            mantenimientos preventivos y monitorear el gasto acumulado por unidad en tu flota comercial.
          </p>
        </div>

        {/* Banner de acceso directo a Sucursales */}
        <div 
          className="card" 
          style={{ 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
            color: '#ffffff', 
            marginBottom: '2.5rem',
            padding: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="badge" style={{ background: '#3b82f6', color: '#fff', marginBottom: '0.75rem' }}>
                Módulo Inicial Activo
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Gestión de Sucursales y Sedes
              </h2>
              <p style={{ color: '#94a3b8', maxWidth: '600px', fontSize: '0.925rem' }}>
                Conéctate con tu base de datos MySQL para consultar, crear, modificar y eliminar las sucursales donde operan tus unidades.
              </p>
            </div>
            <Link to="/sucursales" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}>
              <span>Ir a Sucursales</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Módulos del Sistema */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Módulos de la Plataforma
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {modules.map((mod, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ background: '#f1f5f9', padding: '0.6rem', borderRadius: '8px' }}>
                    {mod.icon}
                  </div>
                  <span className={`badge ${mod.active ? 'badge-blue' : ''}`} style={{ background: mod.active ? undefined : '#f1f5f9', color: mod.active ? undefined : '#64748b' }}>
                    {mod.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  {mod.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {mod.description}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                {mod.active ? (
                  <Link to={mod.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                    <span>Administrar módulo</span>
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>En desarrollo</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

