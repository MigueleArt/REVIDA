'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registrarUsuario } from '../../../services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await registrarUsuario(formData.nombre, formData.email, formData.password);
      // Si se crea bien, lo mandamos al login para que entre
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', fontFamily: 'system-ui' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>Crea tu cuenta</h1>
        <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '24px' }}>Únete a la comunidad de Revida</p>

        {error && <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>Nombre completo</label>
            <input 
              type="text" required 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} 
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>Correo electrónico</label>
            <input 
              type="email" required 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} 
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>Contraseña</label>
            <input 
              type="password" required 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} 
            />
          </div>

          <button 
            type="submit" disabled={isLoading}
            style={{ width: '100%', backgroundColor: '#2563EB', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          ¿Ya tienes cuenta? <Link href="/auth/login" style={{ color: '#2563EB', textDecoration: 'none' }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
