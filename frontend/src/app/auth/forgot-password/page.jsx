'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// 1. Importamos la conexión real que creamos antes
import { solicitarRecuperacion } from '../../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Para el estado de carga
  const [error, setError] = useState(''); // Para manejar errores reales
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 2. LLAMADA REAL AL BACKEND DE RENDER
      await solicitarRecuperacion(email);
      
      // Si todo sale bien, mostramos el mensaje de éxito
      setIsSent(true);
    } catch (err) {
      // 3. SEGURIDAD: Mostramos un mensaje amigable pero no técnico
      setError(err.message || 'No pudimos procesar tu solicitud. Intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="center-screen" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <h1 className="title-blue" style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#2563EB', textAlign: 'center' }}>¿Olvidaste tu contraseña?</h1>
        
        {!isSent ? (
          <form onSubmit={handleSubmit}>
            <p style={{ color: '#6B7280', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
              Introduce tu correo y te enviaremos las instrucciones para recuperarla.
            </p>

            {/* Mensaje de error si falla la conexión o el formato */}
            {error && (
              <div role="alert" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label htmlFor="email-recovery" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Correo electrónico</label>
              <input
                id="email-recovery"
                type="email"
                required
                placeholder="ejemplo@revida.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
              style={{ 
                width: '100%', border: 'none', padding: '12px', borderRadius: '8px', 
                backgroundColor: '#2563EB', color: 'white', fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
            </button>
          </form>
        ) : (
          <div role="alert" aria-live="polite" className="revida-fade-in" style={{ textAlign: 'center' }}>
            <p style={{ color: '#065F46', backgroundColor: '#D1FAE5', padding: '15px', borderRadius: '8px', fontSize: '0.9rem' }}>
              Si el correo <strong>{email}</strong> está registrado, recibirás un mensaje con los pasos a seguir en breve.
            </p>
            <button 
              onClick={() => router.push('/auth/login')} 
              style={{ marginTop: '20px', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', color: '#2563EB' }}
            >
              Volver al inicio de sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}