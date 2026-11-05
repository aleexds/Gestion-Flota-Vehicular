import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, Wrench, DollarSign, MapPin, Building2, ShieldAlert,
  ArrowRight, Layers, Users, CheckCircle2, Globe, Clock,
  BarChart3, ShieldCheck, UserCheck, Smartphone, Mail, Linkedin,
  Github, Menu, X,
} from 'lucide-react';

export default function LandingPage() {
  const [overview, setOverview] = useState({
    loading: true,
    vehiculosActivos: null,
    vehiculosTotal: null,
    ordenesAbiertas: null,
    costoMes: null,
    viajesEnCurso: null,
    talleresTotal: null,
    sucursalesTotal: null,
    conductoresTotal: null,
  });

  useEffect(() => {
    const loadOverview = async () => {
      const response = await fetch('/api/public/metrics');
      if (!response.ok) throw new Error('No se pudieron cargar las métricas públicas.');
      const metrics = await response.json();
      setOverview({ loading: false, ...metrics });
    };

    loadOverview().catch((error) => {
      console.error('Error cargando métricas de la landing:', error);
      setOverview((current) => ({ ...current, loading: false }));
    });
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.landing-page [data-reveal]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const formatCount = (value) => (
    value === null ? '—' : new Intl.NumberFormat('es-CR').format(value)
  );

  const formatCurrency = (value) => (
    value === null ? '—' : `$${new Intl.NumberFormat('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`
  );

  const navLinks = [
    { name: 'Inicio', href: '#' },
    { name: 'Modulos', href: '#modulos' },
    { name: 'Beneficios', href: '#beneficios' },
    { name: 'Casos de Uso', href: '#casos' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const stats = [
    { label: 'Vehículos registrados', value: overview.vehiculosTotal, icon: Truck },
    { label: 'Talleres registrados', value: overview.talleresTotal, icon: Wrench },
    { label: 'Sucursales registradas', value: overview.sucursalesTotal, icon: Building2 },
    { label: 'Conductores registrados', value: overview.conductoresTotal, icon: Users },
  ];

  const previewStats = [
    { label: 'Vehículos operativos', value: overview.vehiculosActivos, format: formatCount },
    { label: 'Órdenes abiertas', value: overview.ordenesAbiertas, format: formatCount },
    { label: 'Costo del mes', value: overview.costoMes, format: formatCurrency },
    { label: 'Viajes en curso', value: overview.viajesEnCurso, format: formatCount },
  ];

  const features = [
    {
      title: 'Control Total de Flota',
      desc: 'Gestiona placas, kilometraje, estado operativo y asignacion de conductores desde un solo panel.',
      icon: Truck,
    },
    {
      title: 'Mantenimiento Preventivo',
      desc: 'Ordenes de servicio, repuestos por orden y catalogo de talleres con calculo automatico de costos.',
      icon: Wrench,
    },
    {
      title: 'Rutas y Logistica',
      desc: 'Asignaciones de viaje, rutas con origen y destino, odometro y trazabilidad de cada unidad.',
      icon: MapPin,
    },
    {
      title: 'Seguros y Siniestros',
      desc: 'Polizas, reclamaciones, deducibles e indemnizaciones vinculadas a cada vehiculo.',
      icon: ShieldCheck,
    },
    {
      title: 'Combustible y Neumaticos',
      desc: 'Registro de cargas, inventario de llantas, montajes y desmontes con historial de eje.',
      icon: DollarSign,
    },
    {
      title: 'Certificaciones de Conductores',
      desc: 'Licencias, vencimientos, tipo de credencial y estado vigente de todo el personal operativo.',
      icon: UserCheck,
    },
  ];

  const modules = [
    { group: 'Mantenimiento & Costos', items: ['Ordenes de Mantenimiento', 'Detalle de Repuestos', 'Catalogo de Repuestos', 'Talleres Proveedores'] },
    { group: 'Flota & Unidades', items: ['Vehiculos', 'Categorias Vehiculares', 'Bases y Sucursales', 'Conductores'] },
    { group: 'Logistica & Viajes', items: ['Rutas', 'Asignaciones de Viaje', 'Inspecciones Pre-Viaje', 'Bitacora Estado'] },
    { group: 'Seguros & Legales', items: ['Polizas de Seguro', 'Siniestros Accidentes', 'Reclamaciones Seguro', 'Sanciones Multas'] },
    { group: 'Neumaticos & Combustible', items: ['Inventario Neumaticos', 'Montajes Neumaticos', 'Cargas Combustible', 'Certificaciones Licencias'] },
  ];

  const useCases = [
    {
      title: 'Flotas de Transporte de Carga',
      desc: 'Control de unidades pesadas, rutas de reparto y mantenimiento preventivo para evitar paradas no programadas.',
    },
    {
      title: 'Empresas de Pasajeros y Turismo',
      desc: 'Gestion de conductores, certificaciones de licencia, seguros de pasajeros y registros de siniestros.',
    },
    {
      title: 'Servicios de Campo y Tecnicos',
      desc: 'Asignacion de viajes, ordenes de mantenimiento y control de combustible para equipos moviles.',
    },
  ];

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              color: '#fff',
              padding: '0.45rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(234, 88, 12, 0.35)',
            }}>
              <Truck size={20} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>FleetOps</span>
          </div>

          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginLeft: '1.5rem',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <Link to="/login" style={{
              textDecoration: 'none',
              color: '#fff',
              background: 'var(--primary)',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 700,
              marginRight: '1rem',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
              transition: 'all 0.2s',
            }}>
              Ingresar al Sistema
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content" data-reveal="left">
          <div className="hero-badge">
            <Globe size={16} />
            <span>Sistema de Gestion de Flota Vehicular</span>
          </div>
          <h1 className="hero-title">
            Optimiza el <br />
            <span className="text-gradient">rendimiento de tu flota vehicular</span>
          </h1>
          <p className="hero-subtitle">
            Plataforma integral para el control de mantenimiento, rutas, combustible, seguros y conductores.
            Gestiona 20 modulos interconectados desde una sola interface profesional.
          </p>
          <div className="hero-actions">
            <Link to="/login" style={{
              textDecoration: 'none',
              background: 'var(--primary)',
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
              transition: 'all 0.2s',
            }}>
              <ArrowRight size={18} /> Probar Sistema
            </Link>
            <a href="#beneficios" onClick={(e) => handleScrollTo(e, '#beneficios')} style={{
              textDecoration: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              padding: '1rem 2rem',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 700,
              border: '2px solid var(--border)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}>
              Ver Caracteristicas
            </a>
          </div>
          <div className="hero-trust">
            <div className="trust-item">
              <CheckCircle2 size={16} color="var(--primary)" />
              <span>99.9% de disponibilidad</span>
            </div>
            <div className="trust-item">
              <Clock size={16} color="var(--primary)" />
              <span>Implantacion en menos de 48h</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={16} color="var(--primary)" />
              <span>Datos cifrados en MySQL</span>
            </div>
          </div>
        </div>
        <div className="hero-visual" data-reveal="right">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <div className="dot red" />
                <div className="dot yellow" />
                <div className="dot green" />
              </div>
              <span className="preview-title">FleetOps - Panel de Control</span>
            </div>
            <div className="preview-grid">
              {previewStats.map((stat) => (
                <div key={stat.label} className="preview-card">
                  <div className="preview-stat">
                    {overview.loading ? '…' : stat.format(stat.value)}
                  </div>
                  <div className="preview-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card" data-reveal style={{ '--reveal-delay': `${i * 90}ms` }}>
                <div className="stat-icon">
                  <stat.icon size={24} />
                </div>
                <div className="stat-value">
                  {overview.loading ? '…' : formatCount(stat.value)}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="features-section">
        <div className="container">
          <div className="section-header" data-reveal>
            <h2 className="section-title">Todo lo que tu flota necesita</h2>
            <p className="section-desc">Modulos especializados para cada area de tu operacion logistica y de mantenimiento.</p>
          </div>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card" data-reveal style={{ '--reveal-delay': `${(i % 3) * 90}ms` }}>
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="modulos" className="modules-section">
        <div className="container">
          <div className="section-header" data-reveal>
            <h2 className="section-title">20 Tablas CRUD Interconectadas</h2>
            <p className="section-desc">Gestiona relaciones complejas (uno a muchos y muchos a muchos) con integridad de datos en tiempo real.</p>
          </div>
          <div className="modules-grid">
            {modules.map((mod, i) => (
              <div key={i} className="module-card" data-reveal style={{ '--reveal-delay': `${(i % 3) * 90}ms` }}>
                <h3 className="module-group">{mod.group}</h3>
                <ul className="module-list">
                  {mod.items.map((item, j) => (
                    <li key={j} className="module-item">
                      <CheckCircle2 size={12} color="var(--primary)" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="casos" className="use-cases-section">
        <div className="container">
          <div className="section-header" data-reveal>
            <h2 className="section-title">Adaptado a tu industria</h2>
            <p className="section-desc">FleetOps se ajusta a distintos tipos de operaciones vehiculares.</p>
          </div>
          <div className="use-cases-grid">
            {useCases.map((uc, i) => (
              <div key={i} className="use-case-card" data-reveal style={{ '--reveal-delay': `${i * 90}ms` }}>
                <h3 className="use-case-title">{uc.title}</h3>
                <p className="use-case-desc">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="contact-section">
        <div className="container">
          <div className="contact-content" data-reveal>
            <div className="contact-info">
              <h2 className="contact-title">Listo para optimizar tu flota?</h2>
              <p className="contact-desc">Contacta con nuestro equipo para una demostracion personalizada de FleetOps.</p>
              <div className="contact-details">
                <div className="contact-item">
                  <Mail size={18} />
                  <span>ventas@fleetops.cr</span>
                </div>
                <div className="contact-item">
                  <Smartphone size={18} />
                  <span>+506 2222 3333</span>
                </div>
              </div>
              <div className="contact-social">
                <a href="#" style={{ marginRight: '1rem', color: 'var(--text-muted)', fontSize: '1.25rem' }}><Linkedin size={20} /></a>
                <a href="#" style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}><Github size={20} /></a>
              </div>
            </div>
            <div className="contact-card">
              <h3 className="contact-card-title">Solicitar Demo</h3>
              <form className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Nombre completo" required style={{
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }} />
                <input type="email" placeholder="Correo electronico" required style={{
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }} />
                <input type="text" placeholder="Empresa / Giro" required style={{
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }} />
                <button type="submit" style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.9rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  Enviar Solicitud
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                color: '#fff',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Truck size={18} />
              </div>
              <span style={{ fontWeight: 800, color: 'var(--text-inverted)' }}>FleetOps</span>
            </div>
            <p className="footer-desc">Sistema de Gestion de Mantenimiento de Flota Vehicular - 20 modulos CRUD, backend Node.js + Express + MySQL, frontend React + Vite.</p>
            <div className="footer-legal">
              <span>© 2026 FleetOps. Todos los derechos reservados.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}