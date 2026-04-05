'use client';

import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function PerfilPage() {
  const { usuario, rol } = useAuth();
  const [activeTab, setActiveTab] = useState('actividad');

  // Valores por defecto
  const userRole = rol || 'Donador';
  const userName = usuario?.nombre || 'Usuario';
  const userEmail = usuario?.email || 'usuario@ejemplo.com';

  return (
    <div style={{
      padding: '40px 20px',
      backgroundColor: '#F9FAFB',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header del Perfil - Tarjeta Principal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Fondo Decorativo */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
          }}></div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '24px', marginTop: '40px' }}>
            {/* Avatar Grande */}
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              backgroundColor: 'white', border: '4px solid white',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem', fontWeight: '800', color: '#2563EB', zIndex: 1
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            
            <div style={{ flex: 1, paddingBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ margin: '0 0 4px 0', fontSize: '2rem', fontWeight: '800', color: '#111827' }}>
                    {userName}
                  </h1>
                  <p style={{ margin: 0, fontSize: '1.05rem', color: '#6B7280' }}>
                    {userEmail}
                  </p>
                </div>
                <button style={{
                  padding: '10px 20px', backgroundColor: '#F3F4F6', border: '1px solid #D1D5DB',
                  borderRadius: '8px', color: '#374151', fontWeight: '600', cursor: 'pointer'
                }}>
                  Editar Perfil
                </button>
              </div>
              <div style={{ marginTop: '16px', display: 'inline-block', padding: '6px 12px', backgroundColor: '#DBEAFE', color: '#1D4ED8', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                Rol: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Navegación del Perfil */}
        <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #E5E7EB', marginBottom: '32px' }}>
          <button 
            onClick={() => setActiveTab('actividad')}
            style={tabStyle(activeTab === 'actividad')}
          >
            Actividad Reciente
          </button>
          <button 
            onClick={() => setActiveTab('ajustes')}
            style={tabStyle(activeTab === 'ajustes')}
          >
            Ajustes de Cuenta
          </button>
        </div>

        {/* Contenido de la Tab Activa */}
        {activeTab === 'actividad' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', margin: '0 0 24px 0' }}>Estadísticas de Impacto</h2>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
              <div style={{ flex: 1, padding: '24px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #F3F4F6', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '2.5rem', fontWeight: '800', color: '#10B981' }}>12</span>
                <span style={{ color: '#6B7280', fontWeight: '500' }}>Artículos Donados</span>
              </div>
              <div style={{ flex: 1, padding: '24px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #F3F4F6', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '2.5rem', fontWeight: '800', color: '#3B82F6' }}>5</span>
                <span style={{ color: '#6B7280', fontWeight: '500' }}>Personas Ayudadas</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#111827', margin: '0 0 16px 0' }}>Últimas Aportaciones</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Ropa de Invierno', 'Caja de Libros', 'Silla de Oficina'].map((item, idx) => (
                <li key={idx} style={{ padding: '16px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>{item}</span>
                  <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Hace {idx + 1} semana{idx > 0 ? 's' : ''}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'ajustes' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', margin: '0 0 24px 0' }}>Configuración de Notificaciones</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#2563EB' }} />
                <span style={{ color: '#374151', fontWeight: '500' }}>Recibir alertas de nuevas solicitudes urgentes</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#2563EB' }} />
                <span style={{ color: '#374151', fontWeight: '500' }}>Correos de resumen semanal</span>
              </label>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '32px 0' }} />

            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', margin: '0 0 24px 0' }}>Seguridad</h2>
            <button style={{
              padding: '10px 20px', backgroundColor: 'white', border: '1px solid #D1D5DB',
              borderRadius: '8px', color: '#374151', fontWeight: '600', cursor: 'pointer'
            }}>
              Cambiar Contraseña
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

const tabStyle = (isActive) => ({
  padding: '0 0 16px 0',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: isActive ? '3px solid #2563EB' : '3px solid transparent',
  color: isActive ? '#2563EB' : '#6B7280',
  fontWeight: isActive ? '700' : '500',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'color 0.2s, border-color 0.2s'
});
