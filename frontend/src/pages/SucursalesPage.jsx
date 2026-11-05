import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Building2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import SucursalList from '../components/SucursalList';
import SucursalForm from '../components/SucursalForm';
import AlertNotification from '../components/AlertNotification';
import { apiFetch } from '../utils/api';

const API_URL = '/api/sucursales';

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  // Cargar sucursales del backend
  const fetchSucursales = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(API_URL);
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setSucursales(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert(`No se pudo conectar con el servidor: ${err.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  // Abrir modal para crear
  const handleOpenCreateModal = () => {
    setSelectedSucursal(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEditModal = (sucursal) => {
    setSelectedSucursal(sucursal);
    setIsModalOpen(true);
  };

  // Guardar (Crear o Actualizar)
  const handleSubmitForm = async (formData, id) => {
    const isEdit = Boolean(id);
    const url = isEdit ? `${API_URL}/${id}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await apiFetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Error en la operación');
    }

    showAlert(
      isEdit ? 'Sucursal actualizada exitosamente' : 'Sucursal creada exitosamente',
      'success'
    );
    fetchSucursales();
  };

  // Eliminar sucursal
  const handleDeleteSucursal = async (sucursal) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de eliminar la sucursal "${sucursal.nombre}" (${sucursal.codigo})?`
    );
    if (!confirmDelete) return;

    try {
      const res = await apiFetch(`${API_URL}/${sucursal.id}`, {
        method: 'DELETE'
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Error al eliminar');
      }

      showAlert(`Sucursal ${sucursal.codigo} eliminada correctamente`, 'success');
      fetchSucursales();
    } catch (err) {
      showAlert(err.message, 'danger');
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <AlertNotification alert={alert} onClose={() => setAlert(null)} />

        <div className="page-header">
          <div>
            <h1 className="page-title">Sucursales y Bases Operativas</h1>
            <p className="page-subtitle">
              Administración centralizada de centros de operación para la flota FleetOps
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button 
              className="btn btn-outline" 
              onClick={fetchSucursales}
              disabled={loading}
              title="Recargar datos"
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              <span>Actualizar</span>
            </button>
            <button className="btn btn-primary" onClick={handleOpenCreateModal}>
              <Plus size={18} />
              <span>Nueva Sucursal</span>
            </button>
          </div>
        </div>

        <SucursalList
          sucursales={sucursales}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteSucursal}
        />

        <SucursalForm
          isOpen={isModalOpen}
          initialData={selectedSucursal}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitForm}
        />
      </main>
    </div>
  );
}

