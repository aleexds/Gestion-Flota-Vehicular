import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Truck } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No se pudo iniciar sesión.');

      localStorage.setItem('fleetops_token', result.token);
      localStorage.setItem('fleetops_user', JSON.stringify(result.usuario));
      const destination = location.state?.from?.pathname;
      navigate(destination?.startsWith('/') ? destination : '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <Link className="auth-back-link" to="/">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        <div className="auth-brand-mark"><Truck size={25} /></div>
        <p className="auth-eyebrow">FLEETOPS · ACCESO SEGURO</p>
        <h1 id="login-title" className="auth-title">Ingresar al sistema</h1>
        <p className="auth-subtitle">Usa tus credenciales autorizadas para acceder al panel de flota.</p>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            name="correo"
            type="email"
            autoComplete="username"
            placeholder="nombre@empresa.com"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <div className="auth-password-wrap">
            <LockKeyhole className="auth-input-icon" size={17} />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Verificando…' : 'Ingresar'}
          </button>
        </form>
        <p className="auth-footnote">El acceso depende del perfil habilitado para FleetOps.</p>
      </section>
    </main>
  );
}
