import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { ENTITIES } from '../config/entitiesConfig';

export default function DynamicModalForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  entityConfig
}) {
  const [formData, setFormData] = useState({});
  const [foreignOptions, setForeignOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(initialData && initialData.id);

  // Cargar opciones foráneas necesarias (ej. listas de vehículos, sucursales, etc.)
  useEffect(() => {
    if (!isOpen || !entityConfig) return;

    const loadForeignData = async () => {
      const foreignFields = entityConfig.fields.filter((f) => f.refEntity);
      const optionsMap = {};

      for (const field of foreignFields) {
        const refConf = ENTITIES[field.refEntity];
        if (refConf) {
          try {
            const res = await fetch(refConf.endpoint);
            if (res.ok) {
              const data = await res.json();
              optionsMap[field.name] = Array.isArray(data) ? data : [];
            }
          } catch (err) {
            console.error(`Error cargando referencias para ${field.name}:`, err);
          }
        }
      }
      setForeignOptions(optionsMap);
    };

    loadForeignData();
  }, [isOpen, entityConfig]);

  // Inicializar o resetear datos del formulario
  useEffect(() => {
    if (!isOpen || !entityConfig) return;

    const defaultState = {};
    entityConfig.fields.forEach((field) => {
      if (initialData && initialData[field.name] !== undefined) {
        // Formatear fechas para los inputs type date/datetime
        if (field.type === 'date' && initialData[field.name]) {
          defaultState[field.name] = String(initialData[field.name]).split('T')[0];
        } else if (field.type === 'datetime-local' && initialData[field.name]) {
          const dt = new Date(initialData[field.name]);
          defaultState[field.name] = dt.toISOString().slice(0, 16);
        } else {
          defaultState[field.name] = initialData[field.name];
        }
      } else {
        defaultState[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
      }
    });

    setFormData(defaultState);
    setError('');
  }, [isOpen, initialData, entityConfig]);

  if (!isOpen || !entityConfig) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación básica de campos requeridos
    for (const field of entityConfig.fields) {
      if (field.required && (formData[field.name] === '' || formData[field.name] === null || formData[field.name] === undefined)) {
        setError(`El campo "${field.label}" es obligatorio.`);
        return;
      }
    }

    try {
      setLoading(true);
      await onSubmit(formData, initialData?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? `Editar ${entityConfig.singular}` : `Registrar ${entityConfig.singular}`}
          </h3>
          <button
            type="button"
            className="btn-icon btn-outline"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" style={{ marginBottom: '1.25rem', padding: '0.65rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={17} />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="form-grid">
              {entityConfig.fields.map((field) => {
                const isFullWidth = field.fullWidth || field.type === 'textarea';

                return (
                  <div key={field.name} className={`form-group ${isFullWidth ? 'full-width' : ''}`}>
                    <label className="form-label" htmlFor={field.name}>
                      {field.label} {field.required && <span style={{ color: 'var(--danger)' }}>*</span>}
                    </label>

                    {/* SELECT: Opciones estáticas o foráneas */}
                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        className="form-select"
                        value={formData[field.name] ?? ''}
                        onChange={handleChange}
                        required={field.required}
                      >
                        <option value="">-- Seleccionar --</option>
                        {field.options ? (
                          field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt.toUpperCase()}
                            </option>
                          ))
                        ) : field.refEntity && foreignOptions[field.name] ? (
                          foreignOptions[field.name].map((item) => (
                            <option key={item[field.refValue]} value={item[field.refValue]}>
                              {field.formatLabel ? field.formatLabel(item) : item[field.refLabel]}
                            </option>
                          ))
                        ) : null}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        className="form-textarea"
                        rows={3}
                        value={formData[field.name] ?? ''}
                        onChange={handleChange}
                        placeholder={`Ingrese ${field.label.toLowerCase()}...`}
                        required={field.required}
                      />
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type || 'text'}
                        className="form-input"
                        value={formData[field.name] ?? ''}
                        onChange={handleChange}
                        placeholder={field.label}
                        required={field.required}
                        step={field.type === 'number' ? 'any' : undefined}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <Save size={16} />
                <span>{loading ? 'Guardando...' : (isEditing ? 'Actualizar Registro' : 'Guardar Registro')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

