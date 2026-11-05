import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck, Truck } from 'lucide-react';

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
      <section className="auth-layout" aria-label="Acceso a FleetOps">
        <aside className="auth-brand-panel">
          <Link className="auth-brand" to="/" aria-label="FleetOps, volver al inicio">
            <span className="auth-brand-icon"><Truck size={23} strokeWidth={2.2} /></span>
            <span>Fleet<span>Ops</span></span>
          </Link>
          <div className="auth-brand-copy">
            <p className="auth-brand-kicker">GESTIÓN DE FLOTA</p>
            <h2>Tu operación,<br />bajo control.</h2>
            <p>Una vista clara para mantener cada vehículo y cada ruta en movimiento.</p>
          </div>
          <div className="auth-brand-bottom">
            <span className="auth-security-icon"><ShieldCheck size={17} /></span>
            <span>Acceso protegido</span>
          </div>
          <div className="auth-brand-lines" aria-hidden="true"><i /><i /><i /></div>
        </aside>

        <div className="auth-form-panel">
          <Link className="auth-back-link" to="/">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
          <div className="auth-form-content">
            <p className="auth-eyebrow">BIENVENIDO</p>
            <h1 id="login-title" className="auth-title">Iniciar sesión</h1>
            <p className="auth-subtitle">Ingresa tus credenciales para continuar a tu espacio de trabajo.</p>

            {error && <div className="auth-error" role="alert">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
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
              </div>

              <div className="auth-field">
                <label htmlFor="password">Contraseña</label>
                <div className="auth-password-wrap">
                  <LockKeyhole className="auth-input-icon" size={17} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Ingresa tu contraseña"
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
              </div>

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? 'Verificando…' : 'Ingresar al sistema'}
              </button>
            </form>
            <p className="auth-footnote"><ShieldCheck size={14} /> Acceso disponible para perfiles autorizados</p>
          </div>
          <span className="auth-copyright">FleetOps · Gestión integral de flota</span>
        </div>
      </section>
    </main>
  );
}
