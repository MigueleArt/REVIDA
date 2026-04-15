'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useAuth from '../../hooks/useAuth';
import useReducedMotion from '../../hooks/useReducedMotion';
import AccessibleLoader from '../../components/AccessibleLoader';
import { getDonaciones } from '../../services/api'; // Asegúrate de tener esta función en tu service

export default function DashboardIndex() {
  const { usuario } = useAuth();
  const reducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, recientes: [] });
  const [error, setError] = useState(null);

  // --- CARGA DE DATOS REALES ---
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setIsLoading(true);
        // Llamada a tu API real en Render
        const res = await getDonaciones(); 
        const datos = res.data || [];
        
        setStats({
          total: datos.length,
          recientes: datos.slice(0, 5) // Tomamos las últimas 5
        });
      } catch (err) {
        console.error("Error cargando dashboard:", err);
        setError("No se pudieron cargar los datos reales.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '60px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
        <AccessibleLoader message="Conectando con la base de datos de Revida..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* ENCABEZADO PERSONALIZADO */}
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>
              Panel Principal
            </h1>
            <p style={{ color: '#6B7280', fontSize: '1.1rem', margin: 0 }}>
              Bienvenido de nuevo, <strong style={{ color: '#2563EB' }}>{usuario?.nombre || 'Alan'}</strong>.
            </p>
          </div>
          
          {/* LINK REAL AL PERFIL */}
          <Link href="/dashboard/perfil" style={{
            padding: '12px 24px', backgroundColor: 'white', color: '#374151',
            borderRadius: '12px', border: '1px solid #E5E7EB', textDecoration: 'none',
            fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: '0.2s'
          }}>
            ⚙️ Mi Configuración
          </Link>
        </header>

        {/* INDICADORES REALES (KPIs) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={cardStyle}>
            <p style={labelStyle}>Mis Donaciones Activas</p>
            <h3 style={valueStyle}>{stats.total}</h3>
            <p style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: '600' }}>Sincronizado </p>
          </div>
          
          <div style={cardStyle}>
            <p style={labelStyle}>Estado de Cuenta</p>
            <h3 style={valueStyle}>Activo</h3>
            <Link href="/dashboard/perfil" style={{ color: '#2563EB', fontSize: '0.85rem', textDecoration: 'none' }}>Ver detalles del perfil →</Link>
          </div>
        </div>

        {/* TABLA DE ACTIVIDAD REAL */}
        <section style={{ backgroundColor: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #E5E7EB' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Actividad Reciente</h2>
          
          {stats.recientes.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #F3F4F6', color: '#6B7280' }}>
                    <th style={{ padding: '12px' }}>Artículo</th>
                    <th style={{ padding: '12px' }}>Ubicación</th>
                    <th style={{ padding: '12px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recientes.map((item) => (
                    <tr key={item._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{item.titulo}</td>
                      <td style={{ padding: '12px' }}>{item.ubicacion}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                          Disponible
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#6B7280' }}>Aún no tienes donaciones registradas.</p>
              <Link href="/dashboard/publicar" style={{ color: '#2563EB', fontWeight: 'bold' }}>¡Comienza a donar ahora!</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ESTILOS REUTILIZABLES
const cardStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const labelStyle = { margin: '0 0 8px 0', color: '#6B7280', fontWeight: '500' };
const valueStyle = { margin: '0 0 12px 0', fontSize: '2.2rem', fontWeight: '800', color: '#111827' };
