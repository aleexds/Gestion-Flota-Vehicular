import React, { useState } from 'react';
import { Edit2, Trash2, Search, MapPin, Phone, Building2 } from 'lucide-react';

export default function SucursalList({ sucursales, onEdit, onDelete, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSucursales = sucursales.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      (s.nombre && s.nombre.toLowerCase().includes(term)) ||
      (s.codigo && s.codigo.toLowerCase().includes(term)) ||
      (s.ciudad && s.ciudad.toLowerCase().includes(term))
    );
  });

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Barra de Búsqueda y Estadísticas */}
      <div 
        style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search 
            size={16} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder="Buscar por nombre, código o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Total registradas: <strong>{sucursales.length}</strong>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>Código</th>
              <th>Nombre de Sucursal</th>
              <th>Ciudad</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Cargando sucursales desde FleetOps API...
                </td>
              </tr>
            ) : filteredSucursales.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <Building2 size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {searchTerm ? 'No se encontraron sucursales para tu búsqueda' : 'No hay sucursales registradas'}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {searchTerm ? 'Intenta con otro término de búsqueda.' : 'Haz clic en "Nueva Sucursal" para agregar la primera.'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredSucursales.map((sucursal) => (
                <tr key={sucursal.id}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                    #{sucursal.id}
                  </td>
                  <td>
                    <span className="badge badge-blue">
                      {sucursal.codigo}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {sucursal.nombre}
                  </td>
                  <td>
                    {sucursal.ciudad ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={14} color="var(--text-muted)" />
                        {sucursal.ciudad}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td>
                    {sucursal.telefono ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={14} color="var(--text-muted)" />
                        {sucursal.telefono}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sucursal.direccion || <span style={{ color: 'var(--text-muted)' }}>-</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn-icon btn-outline"
                        title="Editar sucursal"
                        onClick={() => onEdit(sucursal)}
                      >
                        <Edit2 size={15} color="var(--primary)" />
                      </button>
                      <button
                        type="button"
                        className="btn-icon btn-danger"
                        title="Eliminar sucursal"
                        onClick={() => onDelete(sucursal)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

