'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleValidate = (e) => {
    e.preventDefault();
    if (passwords.new.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    alert("¡Contraseña cambiada con éxito!");
    router.push('/auth/login');
  };

  return (
    <div className="center-screen">
      <form onSubmit={handleValidate} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h2 className="title-blue" style={{ fontSize: '1.5rem' }}>Nueva Contraseña</h2>
        <p style={{ color: '#6B7280', marginBottom: '20px', fontSize: '0.9rem' }}>Crea una contraseña segura que no hayas usado antes.</p>

        {error && <p role="alert" style={{ color: '#B91C1C', backgroundColor: '#FEE2E2', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>{error}</p>}

        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label htmlFor="new-p">Nueva contraseña</label>
          <input id="new-p" type="password" required className="revida-loader" style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #D1D5DB' }}
            onChange={(e) => {setPasswords({...passwords, new: e.target.value}); setError('');}} />
        </div>

        <div style={{ textAlign: 'left', marginBottom: '25px' }}>
          <label htmlFor="conf-p">Confirmar contraseña</label>
          <input id="conf-p" type="password" required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
            onChange={(e) => {setPasswords({...passwords, confirm: e.target.value}); setError('');}} />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none' }}>Cambiar contraseña</button>
      </form>
    </div>
  );
}