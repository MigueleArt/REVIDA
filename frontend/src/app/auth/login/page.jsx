'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loginUsuario } from '../../../services/api';
import useReducedMotion from '../../../hooks/useReducedMotion';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [isLoading, setIsLoading] = useState(false);
  const reducedMotion = useReducedMotion();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const hasEmailError = !!errors.email;
  const hasPasswordError = !!errors.password;
  const hasGeneralError = !!errors.general;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar error del campo al escribir
    if (errors[e.target.name] || errors.general) {
      setErrors({ ...errors, [e.target.name]: '', general: '' });
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: '', password: '', general: '' });

    // --- Validación en cliente ---
    const newErrors = { email: '', password: '', general: '' };
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Ingrese un correo electrónico válido.';
    }
    if (!formData.password) {
      newErrors.password = 'Ingrese su contraseña.';
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // --- Llamar al API de login ---
    try {
      const result = await loginUsuario(formData.email, formData.password);

      // Redirigir según rol
      if (result.rol === 'admin') {
        router.push('/dashboard/usuarios');
      } else {
        router.push('/dashboard/mis-donativos');
      }
    } catch (err) {
      // Soporte para múltiples sesiones y errores seguros
      let mensajeError = 'Credenciales incorrectas o problema de conexión.';
      
      // Si el servidor envía un código específico para sesiones múltiples
      if (err.message.includes('sesión activa') || err.status === 409) {
        mensajeError = 'Ya hay una sesión activa en otro dispositivo. Por favor, cierra la anterior.';
      } else if (err.status === 500) {
        mensajeError = 'Error en el servidor. Inténtelo más tarde.'; // No mostramos el error técnico
      }

      setErrors({ ...errors, general: mensajeError });
      passwordRef.current?.focus();
    } finally {
      // ESTO HACE QUE EL LOGIN SEA FLUIDO:
      // El botón se desbloquea SIEMPRE, ya sea que salga bien o mal.
      setIsLoading(false); 
    }
  };

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F3F4F6'
    }}>

      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>

        <div style={{ marginBottom: '20px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#2563EB" style={{ margin: '0 auto' }} aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <h1 style={{ color: '#111827', margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Bienvenido a Revida
        </h1>
        <p style={{ color: '#6B7280', margin: '0 0 24px 0', fontSize: '0.95rem' }}>
          Inicia sesión para continuar
        </p>

        {/* Contenedor de error general — accesible con aria-live */}
        <div
          id="login-error"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{
            backgroundColor: hasGeneralError ? '#FEE2E2' : 'transparent',
            color: '#B91C1C',
            padding: hasGeneralError ? '12px' : '0',
            borderRadius: '8px',
            marginBottom: hasGeneralError ? '20px' : '0',
            fontSize: '0.9rem',
            textAlign: 'left',
            minHeight: hasGeneralError ? 'auto' : '0',
          }}
        >
          {hasGeneralError && errors.general}
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Campo Correo electrónico */}
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <label
              htmlFor="login-email"
              style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}
            >
              Correo electrónico
            </label>
            <input
              ref={emailRef}
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              aria-invalid={hasEmailError}
              aria-describedby={hasEmailError ? 'email-error' : undefined}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: `1px solid ${hasEmailError ? '#EF4444' : '#D1D5DB'}`,
                fontSize: '1rem', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {hasEmailError && (
              <p
                id="email-error"
                role="alert"
                style={{ color: '#EF4444', fontSize: '0.85rem', margin: '6px 0 0 0' }}
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <label
              htmlFor="login-password"
              style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}
            >
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                ref={passwordRef}
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                aria-invalid={hasPasswordError}
                aria-describedby={hasPasswordError ? 'password-error' : hasGeneralError ? 'login-error' : undefined}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '8px',
                  border: `1px solid ${hasPasswordError ? '#EF4444' : '#D1D5DB'}`,
                  fontSize: '1rem', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '0.85rem'
                }}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {hasPasswordError && (
              <p
                id="password-error"
                role="alert"
                style={{ color: '#EF4444', fontSize: '0.85rem', margin: '6px 0 0 0' }}
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Botón de enviar */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', backgroundColor: '#2563EB', color: 'white',
              padding: '12px', borderRadius: '8px', border: 'none',
              fontSize: '1rem', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: reducedMotion ? 'none' : 'background 0.2s', opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

      </div>
    </div>
  );
}