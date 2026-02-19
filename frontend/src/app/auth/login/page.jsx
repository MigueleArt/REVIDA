'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email || !formData.email.includes('@')) {
      setError('Correo inválido');
      setIsLoading(false);
      emailRef.current?.focus();
      return;
    }

    if (!formData.password) {
      setError('Falta la contraseña');
      setIsLoading(false);
      passwordRef.current?.focus();
      return;
    }

    setTimeout(() => {
      if (formData.email === 'test@revida.com' && formData.password === '123456') {
        router.push('/');
      } else {
        setError('Credenciales incorrectas');
        setIsLoading(false);
        passwordRef.current?.focus();
      }
    }, 1000);
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
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#2563EB" style={{ margin: '0 auto' }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>

        <h2 style={{ color: '#111827', margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Bienvenido a Revida
        </h2>
        <p style={{ color: '#6B7280', margin: '0 0 24px 0', fontSize: '0.95rem' }}>
          Inicia sesión para continuar
        </p>

        {error && (
          <div role="alert" style={{ 
            backgroundColor: '#FEE2E2', color: '#B91C1C', 
            padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'left'
          }}>
            Ingrese sus datos correctamente: {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
              Correo electrónico
            </label>
            <input
              ref={emailRef}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="test@revida.com"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                ref={passwordRef}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="123456"
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '8px',
                  border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '0.85rem'
                }}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%', backgroundColor: '#2563EB', color: 'white',
              padding: '12px', borderRadius: '8px', border: 'none',
              fontSize: '1rem', fontWeight: '600', cursor: 'pointer', 
              transition: 'background 0.2s', opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        
      </div>
    </div>
  );
}