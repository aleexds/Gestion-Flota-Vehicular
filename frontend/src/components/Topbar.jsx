import React from 'react';
import { Shield, Activity, Database } from 'lucide-react';

export default function Topbar({ title = 'FleetOps - Gestión Integral de Flota' }) {
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
      </div>
    </header>
  );
}

