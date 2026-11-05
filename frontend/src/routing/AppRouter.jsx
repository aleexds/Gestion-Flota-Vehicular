import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import EntityManagerPage from '../pages/EntityManagerPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard Principal */}
        <Route path="/" element={<HomePage />} />

        {/* Gestor CRUD dinamico para las 20 entidades */}
        <Route path="/modulo/:entityKey" element={<EntityManagerPage />} />

        {/* Alias directos -- entidades originales */}
        <Route path="/sucursales" element={<Navigate to="/modulo/sucursales" replace />} />
        <Route path="/vehiculos" element={<Navigate to="/modulo/vehiculos" replace />} />
        <Route path="/conductores" element={<Navigate to="/modulo/conductores" replace />} />
        <Route path="/rutas" element={<Navigate to="/modulo/rutas" replace />} />
        <Route path="/ordenes-mantenimiento" element={<Navigate to="/modulo/ordenes-mantenimiento" replace />} />
        <Route path="/categorias-vehiculo" element={<Navigate to="/modulo/categorias-vehiculo" replace />} />
        <Route path="/talleres-proveedores" element={<Navigate to="/modulo/talleres-proveedores" replace />} />
        <Route path="/catalogo-repuestos" element={<Navigate to="/modulo/catalogo-repuestos" replace />} />
        <Route path="/polizas-seguro" element={<Navigate to="/modulo/polizas-seguro" replace />} />
        <Route path="/asignaciones-viaje" element={<Navigate to="/modulo/asignaciones-viaje" replace />} />
        <Route path="/detalles-repuestos-orden" element={<Navigate to="/modulo/detalles-repuestos-orden" replace />} />

        {/* Alias directos -- 9 entidades nuevas */}
        <Route path="/inventario-neumaticos" element={<Navigate to="/modulo/inventario-neumaticos" replace />} />
        <Route path="/certificaciones-licencias" element={<Navigate to="/modulo/certificaciones-licencias" replace />} />
        <Route path="/inspecciones-pre-viaje" element={<Navigate to="/modulo/inspecciones-pre-viaje" replace />} />
        <Route path="/bitacora-estado-vehiculo" element={<Navigate to="/modulo/bitacora-estado-vehiculo" replace />} />
        <Route path="/cargas-combustible" element={<Navigate to="/modulo/cargas-combustible" replace />} />
        <Route path="/siniestros-accidentes" element={<Navigate to="/modulo/siniestros-accidentes" replace />} />
        <Route path="/sanciones-multas" element={<Navigate to="/modulo/sanciones-multas" replace />} />
        <Route path="/montaje-neumaticos" element={<Navigate to="/modulo/montaje-neumaticos" replace />} />
        <Route path="/reclamaciones-seguro" element={<Navigate to="/modulo/reclamaciones-seguro" replace />} />

        {/* Redireccion por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
