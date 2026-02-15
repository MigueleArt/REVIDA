import React from 'react';

export default function CardDonacion({ item }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
      border: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      height: '100%', 
      transition: 'transform 0.2s',
      cursor: 'pointer'
    }}>
      
      <div style={{ 
        height: '180px', 
        backgroundColor: '#F3F4F6', 
        backgroundImage: item.imagen ? `url(${item.imagen})` : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {!item.imagen && <span style={{ fontSize: '4rem' }}>{item.icono}</span>}

        <div style={{ 
          position: 'absolute', 
          top: '12px', 
          right: '12px', 
          backgroundColor: 'white', 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '0.75rem', 
          fontWeight: '600', 
          color: '#2563EB',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
           {item.categoria}
        </div>
      </div>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '1.1rem', 
          fontWeight: '700', 
          color: '#111827' 
        }}>
          {item.titulo}
        </h3>

        <p style={{ 
          margin: '0 0 16px 0', 
          fontSize: '0.9rem', 
          color: '#6B7280', 
          lineHeight: '1.4',
          flex: 1 
        }}>
          {item.descripcion}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#4B5563' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {item.ubicacion}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#4B5563' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {item.fecha}
          </div>

        </div>

        <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '16px' }}>
          Donado por: <span style={{ color: '#4B5563', fontWeight: '500' }}>{item.usuario}</span>
        </div>

        <button style={{
          width: '100%',
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '0.95rem',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}>
          Solicitar Donación
        </button>

      </div>
    </div>
  );
}