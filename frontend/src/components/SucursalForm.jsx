import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';

export default function SucursalForm({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    direccion: '',
    telefono: '',
    ciudad: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(initialData && initialData.id);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        codigo: initialData.codigo || '',
        direccion: initialData.direccion || '',
        telefono: initialData.telefono || '',
        ciudad: initialData.ciudad || ''
      });
    } else {
      setFormData({
        nombre: '',
        codigo: '',
        direccion: '',
        telefono: '',
        ciudad: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim() || !formData.codigo.trim()) {
      setError('El nombre y el código de la sucursal son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData, initialData?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar la sucursal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={20} color="var(--primary)" />
            <h3 className="modal-title">
              {isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}
            </h3>
          </div>
          <button 
            type="button" 
            className="btn-icon btn-outline" 
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem', padding: '0.6rem 1rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="nombre">
                Nombre de la Sucursal *
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className="form-input"
                placeholder="Ej. Base Operativa Norte"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="codigo">
                Código Único *
              </label>
              <input
                id="codigo"
                name="codigo"
                type="text"
                className="form-input"
                placeholder="Ej. SUC-001"
                value={formData.codigo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ciudad">
                Ciudad
              </label>
              <input
                id="ciudad"
                name="ciudad"
                type="text"
                className="form-input"
                placeholder="Ej. San José"
                value={formData.ciudad}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="telefono">
                Teléfono de Contacto
              </label>
              <input
                id="telefono"
                name="telefono"
                type="text"
                className="form-input"
                placeholder="Ej. +506 2222-3333"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="direccion">
                Dirección Completa
              </label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                className="form-input"
                placeholder="Ej. Av. Central, 200m Norte de la Terminal"
                value={formData.direccion}
                onChange={handleChange}
              />
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
                <span>{loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar Sucursal')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

