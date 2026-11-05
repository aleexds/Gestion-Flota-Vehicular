import React from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, Building2, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="navbar-logo-badge">
            <Truck size={20} />
          </div>
          <span>FleetOps</span>
        </NavLink>

        <nav>
          <ul className="navbar-nav">
            <li>
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/sucursales" 
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} />
                  <span>Sucursales</span>
                </div>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

