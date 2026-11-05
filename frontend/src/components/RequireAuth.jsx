import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function RequireAuth() {
  const location = useLocation();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('fleetops_token');
    if (!token) {
      setStatus('unauthenticated');
      return () => { mounted = false; };
    }

    apiFetch('/api/auth/me')
      .then(async (response) => {
        if (!response.ok) throw new Error('Sesión inválida');
        const data = await response.json();
        localStorage.setItem('fleetops_user', JSON.stringify(data.usuario));
        if (mounted) setStatus('authenticated');
      })
      .catch(() => {
        localStorage.removeItem('fleetops_token');
        localStorage.removeItem('fleetops_user');
        if (mounted) setStatus('unauthenticated');
      });

    return () => { mounted = false; };
  }, []);

  if (status === 'checking') {
    return <div className="auth-loading" role="status">Verificando sesión…</div>;
  }
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
