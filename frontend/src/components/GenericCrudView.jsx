import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Search, Edit2, Trash2, FolderOpen } from 'lucide-react';
import DynamicModalForm from './DynamicModalForm';
import { apiFetch } from '../utils/api';

export default function GenericCrudView({ entityConfig, onNotify }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(entityConfig.endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Error al obtener datos`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      if (onNotify) onNotify(`Error cargando ${entityConfig.plural}: ${err.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setSearchTerm('');
    setSelectedItem(null);
    setIsModalOpen(false);
  }, [entityConfig.key]);

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData, id) => {
    const isEdit = Boolean(id);
    const url = isEdit ? `${entityConfig.endpoint}/${id}` : entityConfig.endpoint;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Error en la operación del servidor');
    }

    if (onNotify) {
      onNotify(
        isEdit ? `${entityConfig.singular} actualizado(a) exitosamente` : `${entityConfig.singular} registrado(a) con éxito`,
        'success'
      );
    }
    fetchData();
  };

  const handleDelete = async (item) => {
    const identifier = item.placa || item.nombre || item.codigo || item.codigo_parte || item.numero_poliza || `#${item.id}`;
    const confirmed = window.confirm(`¿Confirmas la eliminación del registro ${identifier}?`);
    if (!confirmed) return;

    try {
      const res = await apiFetch(`${entityConfig.endpoint}/${item.id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Error al eliminar');

      if (onNotify) onNotify(`Registro eliminado correctamente`, 'success');
      fetchData();
    } catch (err) {
      if (onNotify) onNotify(err.message, 'danger');
    }
  };

  // Filtrado de búsqueda en tiempo real
  const filteredData = data.filter((row) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(row).some((val) => {
      if (val === null || val === undefined) return false;
      if (typeof val === 'object') return false;
      return String(val).toLowerCase().includes(term);
    });
  });

  const getBadgeClass = (value) => {
    const v = String(value || '').toLowerCase();
    if (['operativo', 'activo', 'vigente', 'completado'].includes(v)) return 'badge-green';
    if (['en_mantenimiento', 'en_proceso', 'en_curso', 'preventivo'].includes(v)) return 'badge-amber';
    if (['fuera_de_servicio', 'suspendido', 'inactivo', 'cancelada', 'cancelado', 'correctivo', 'vencida'].includes(v)) return 'badge-red';
    return 'badge-orange';
  };

  return (
    <div>
      {/* Encabezado de página */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{entityConfig.plural}</h1>
          <p className="page-subtitle">{entityConfig.description}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            className="btn btn-outline"
            onClick={fetchData}
            disabled={loading}
            title="Recargar registros"
          >
            <RefreshCw size={16} />
            <span>Actualizar</span>
          </button>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={18} />
            <span>Nuevo {entityConfig.singular}</span>
          </button>
        </div>
      </div>

      {/* Contenedor de Tabla y Filtro */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '1.15rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            backgroundColor: '#ffffff'
          }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder={`Buscar en ${entityConfig.plural.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Registros en base de datos: <strong>{data.length}</strong>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                {entityConfig.tableColumns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={entityConfig.tableColumns.length + 1} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Cargando información desde la base de datos MySQL...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={entityConfig.tableColumns.length + 1} style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
                    <FolderOpen size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                    <p style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      {searchTerm ? 'No se encontraron registros para tu búsqueda' : `No hay ${entityConfig.plural.toLowerCase()} registrados(as)`}
                    </p>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      {searchTerm ? 'Prueba con otro término de búsqueda.' : `Haz clic en "Nuevo ${entityConfig.singular}" para registrar el primero.`}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id}>
                    {entityConfig.tableColumns.map((col) => {
                      const val = col.render ? col.render(row) : row[col.key];
                      return (
                        <td key={col.key}>
                          {col.badge ? (
                            <span className={`badge ${getBadgeClass(val)}`}>
                              {val}
                            </span>
                          ) : (
                            val || <span style={{ color: 'var(--text-muted)' }}>-</span>
                          )}
                        </td>
                      );
                    })}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn-icon btn-outline"
                          title="Editar registro"
                          onClick={() => handleOpenEdit(row)}
                        >
                          <Edit2 size={15} color="var(--primary)" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-danger"
                          title="Eliminar registro"
                          onClick={() => handleDelete(row)}
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

      {/* Formulario Modal Dinámico */}
      <DynamicModalForm
        isOpen={isModalOpen}
        initialData={selectedItem}
        entityConfig={entityConfig}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

