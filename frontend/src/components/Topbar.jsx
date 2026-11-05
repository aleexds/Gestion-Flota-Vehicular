import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, Database, LogOut } from 'lucide-react';

export default function Topbar({ title = 'FleetOps - Gestión Integral de Flota' }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('fleetops_token');
    localStorage.removeItem('fleetops_user');
    navigate('/', { replace: true });
  };

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {title}
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div className="topbar-status">
          <div className="status-dot"></div>
          <span>API Backend Online</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Database size={15} color="var(--primary)" />
          <span>flotavehicular</span>
        </div>
        <button type="button" className="btn btn-outline" onClick={handleLogout} aria-label="Cerrar sesión">
          <LogOut size={15} />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}

