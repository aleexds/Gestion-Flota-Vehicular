import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import EntityManagerPage from '../pages/EntityManagerPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard Principal con enfoque temático al problema y solución */}
        <Route path="/" element={<HomePage />} />

        {/* Gestor CRUD para las 11 entidades */}
        <Route path="/modulo/:entityKey" element={<EntityManagerPage />} />

        {/* Alias directos para acceso rápido a cada una de las 11 tablas */}
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

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
