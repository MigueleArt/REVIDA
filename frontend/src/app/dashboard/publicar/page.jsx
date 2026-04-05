'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useReducedMotion from '../../../hooks/useReducedMotion';

export default function PublicarPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Ropa',
    condicion: 'Bueno',
    ubicacion: '',
    imagen: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      // After showing success for 2 seconds, redirect to donations list
      setTimeout(() => {
        router.push('/dashboard/mis-donativos');
      }, 2000);
    }, 1200);
  };

  if (success) {
    return (
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#F9FAFB' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '60px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <div style={{ 
            width: '80px', height: '80px', backgroundColor: '#D1FAE5', color: '#10B981', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 24px', fontSize: '2rem' 
          }}>
            ✓
          </div>
          <h2 style={{ color: '#111827', fontSize: '1.8rem', marginBottom: '8px' }}>¡Donación Publicada!</h2>
          <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Gracias por tu generosidad. Redirigiendo a tus donaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px 20px',
      backgroundColor: '#F9FAFB',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Publicar Donación
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.1rem', margin: 0 }}>
            Llena los detalles del artículo que deseas donar a la comunidad.
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Título del Artículo *</label>
              <input 
                type="text" 
                name="titulo" 
                required 
                value={formData.titulo} 
                onChange={handleChange}
                placeholder="Ej. Laptop Asus, Ropa de invierno..." 
                style={inputStyle} 
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Descripción *</label>
              <textarea 
                name="descripcion" 
                required 
                rows="4"
                value={formData.descripcion} 
                onChange={handleChange}
                placeholder="Describe el estado del artículo, tallas, características, etc." 
                style={{ ...inputStyle, resize: 'vertical' }} 
              />
            </div>

            <div>
              <label style={labelStyle}>Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange} style={inputStyle}>
                <option value="Ropa">Ropa</option>
                <option value="Electrónicos">Electrónicos</option>
                <option value="Muebles">Muebles</option>
                <option value="Libros">Libros</option>
                <option value="Deportes">Deportes</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Condición</label>
              <select name="condicion" value={formData.condicion} onChange={handleChange} style={inputStyle}>
                <option value="Nuevo">Nuevo</option>
                <option value="Como nuevo">Como nuevo</option>
                <option value="Bueno">Bueno (uso normal)</option>
                <option value="Aceptable">Aceptable (con detalles)</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Ubicación / Zona de Entrega *</label>
              <input 
                type="text" 
                name="ubicacion" 
                required 
                value={formData.ubicacion} 
                onChange={handleChange}
                placeholder="Ej. Centro de Tehuacán, Plaza Principal..." 
                style={inputStyle} 
              />
            </div>

            {/* Subida de Imagen (Simulada) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Fotografía del Artículo</label>
              <div style={{
                border: '2px dashed #D1D5DB',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#F9FAFB',
                cursor: 'pointer',
                transition: reducedMotion ? 'none' : 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              >
                <svg width="40" height="40" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span style={{ color: '#4B5563', fontWeight: '500', fontSize: '1rem', display: 'block', marginBottom: '4px' }}>
                  Haz clic para subir o arrastra una imagen
                </span>
                <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>PNG, JPG hasta 5MB</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button 
              type="button" 
              onClick={() => router.back()}
              style={{
                padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid #D1D5DB',
                borderRadius: '8px', color: '#4B5563', fontWeight: '600', fontSize: '1rem', cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                padding: '12px 32px', backgroundColor: '#2563EB', border: 'none',
                borderRadius: '8px', color: 'white', fontWeight: '600', fontSize: '1rem', 
                cursor: isSubmitting ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
              }}
            >
              {isSubmitting ? (
                <>
                  <svg className="revida-spinner" width="18" height="18" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                    <circle cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeDasharray="80, 200" />
                  </svg>
                  Publicando...
                </>
              ) : (
                'Publicar Artículo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#374151',
  fontSize: '0.95rem'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid #D1D5DB',
  outline: 'none',
  fontSize: '1rem',
  color: '#111827',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit'
};
