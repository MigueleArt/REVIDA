'use client';

import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useReducedMotion from '../../hooks/useReducedMotion';
import AccessibleLoader from '../../components/AccessibleLoader';

export default function DashboardIndex() {
  const { usuario, rol } = useAuth();
  const reducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);

  // MOCK DATA PARA SOLICITUDES Y KPIs
  const [solicitudes, setSolicitudes] = useState([
    { id: 'SOL-001', usuario: 'Maria G.', articulo: 'Silla de Ruedas', estado: 'Pendiente', fecha: '2026-04-03' },
    { id: 'SOL-002', usuario: 'Juan P.', articulo: 'Ropa de Invierno', estado: 'Aprobada', fecha: '2026-04-02' },
    { id: 'SOL-003', usuario: 'Colegio Sn José', articulo: 'Libros de Texto', estado: 'Pendiente', fecha: '2026-04-01' },
    { id: 'SOL-004', usuario: 'Laura M.', articulo: 'Medicamentos', estado: 'Rechazada', fecha: '2026-03-30' },
  ]);

  const kpis = [
    { title: 'Usuarios Activos', value: '1,245', change: '+12%', color: '#3B82F6', icon: 'users' },
    { title: 'Donaciones Activas', value: '342', change: '+5%', color: '#10B981', icon: 'heart' },
    { title: 'Solicitudes Pendientes', value: '28', change: '-2%', color: '#F59E0B', icon: 'alert' },
    { title: 'Impacto Estimado', value: '5.2K', change: '+18%', color: '#8B5CF6', icon: 'globe' },
  ];

  useEffect(() => {
    // Simular carga de servidor
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAprobar = (id) => {
    setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: 'Aprobada' } : s));
  };

  const handleRechazar = (id) => {
    setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: 'Rechazada' } : s));
  };

  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'users':
        return <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />;
      case 'heart':
        return <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />;
      case 'alert':
        return <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'globe':
        return <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '60px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
        <AccessibleLoader message="Cargando panel de control..." />
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#F9FAFB',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Panel Principal
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.1rem', margin: 0 }}>
            Hola, <strong style={{ color: '#374151' }}>{usuario?.nombre || 'Administrador'}</strong>. Aquí tienes un resumen de la plataforma.
          </p>
        </header>

        {/* KPIs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {kpis.map((kpi, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              transition: reducedMotion ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              if(!reducedMotion) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
              }
            }}
            onMouseOut={(e) => {
              if(!reducedMotion) {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
              }
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="24" height="24" fill="none" stroke={kpi.color} strokeWidth="2" viewBox="0 0 24 24">
                    {renderIcon(kpi.icon)}
                  </svg>
                </div>
                <span style={{
                  fontSize: '0.85rem', fontWeight: '600', color: kpi.change.startsWith('+') ? '#10B981' : '#EF4444',
                  backgroundColor: kpi.change.startsWith('+') ? '#D1FAE5' : '#FEE2E2',
                  padding: '4px 8px', borderRadius: '20px'
                }}>
                  {kpi.change}
                </span>
              </div>
              <p style={{ margin: '0 0 4px 0', color: '#6B7280', fontSize: '0.95rem', fontWeight: '500' }}>{kpi.title}</p>
              <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#111827', fontWeight: '800' }}>{kpi.value}</h3>
            </div>
          ))}
        </div>

        {/* Tabla de Solicitudes Recientes (Solo Admin o para demo general) */}
        <section style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>Solicitudes Recientes</h2>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>Gestión rápida de donaciones y requerimientos.</p>
            </div>
            <button style={{
              background: 'transparent', border: '1px solid #D1D5DB', borderRadius: '8px',
              padding: '8px 16px', color: '#374151', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer'
            }}>
              Ver Todo
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F3F4F6', color: '#6B7280', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '16px 8px', fontWeight: '600' }}>ID Solicitud</th>
                  <th style={{ padding: '16px 8px', fontWeight: '600' }}>Usuario</th>
                  <th style={{ padding: '16px 8px', fontWeight: '600' }}>Artículo</th>
                  <th style={{ padding: '16px 8px', fontWeight: '600' }}>Fecha</th>
                  <th style={{ padding: '16px 8px', fontWeight: '600' }}>Estado</th>
                  <th style={{ padding: '16px 8px', fontWeight: '600', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 8px', fontWeight: '600', color: '#111827' }}>{solicitud.id}</td>
                    <td style={{ padding: '16px 8px', color: '#4B5563' }}>{solicitud.usuario}</td>
                    <td style={{ padding: '16px 8px', color: '#4B5563' }}>{solicitud.articulo}</td>
                    <td style={{ padding: '16px 8px', color: '#6B7280', fontSize: '0.9rem' }}>{solicitud.fecha}</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{
                        padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                        backgroundColor: solicitud.estado === 'Aprobada' ? '#D1FAE5' : solicitud.estado === 'Rechazada' ? '#FEE2E2' : '#FEF3C7',
                        color: solicitud.estado === 'Aprobada' ? '#065F46' : solicitud.estado === 'Rechazada' ? '#991B1B' : '#92400E'
                      }}>
                        {solicitud.estado}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      {solicitud.estado === 'Pendiente' ? (
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => handleAprobar(solicitud.id)} style={{
                            background: '#10B981', color: 'white', border: 'none', borderRadius: '6px',
                            padding: '6px 12px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer'
                          }}>Aprobar</button>
                          <button onClick={() => handleRechazar(solicitud.id)} style={{
                            background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px',
                            padding: '6px 12px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer'
                          }}>Rechazar</button>
                        </div>
                      ) : (
                        <span style={{ color: '#9CA3AF', fontSize: '0.85rem', fontStyle: 'italic' }}>Revisada</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
