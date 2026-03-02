'use client';

import { useState, useRef } from 'react';
import CardDonacion from '../../../components/CardDonacion';
import AccessibleLoader from '../../../components/AccessibleLoader';
import useReducedMotion from '../../../hooks/useReducedMotion';

export default function MisDonativosPage() {

  // --- 1. DATOS (MOCK) ---
  const allDonaciones = [
    { id: 1, titulo: 'Laptop Asus', descripcion: 'Laptop en buen estado, ideal para estudiantes.', ubicacion: 'Ciudad Ajalpan', fecha: '2026-02-01', usuario: 'Fatima Avelino', categoria: 'Electrónicos', icono: '💻' },
    { id: 2, titulo: 'Ropa de invierno', descripcion: 'Conjunto de abrigos, tallas variadas.', ubicacion: 'San Bartolo', fecha: '2026-02-03', usuario: 'Jose Miguel', categoria: 'Ropa', icono: '🧥' },
    { id: 3, titulo: 'Sofá de 3 plazas', descripcion: 'Sofá cómodo en buen estado, color gris.', ubicacion: 'Tehuacán', fecha: '2026-12-05', usuario: 'Alberto ', categoria: 'Muebles', icono: '🛋️' },
    { id: 4, titulo: 'Libros de texto', descripcion: 'Colección de libros universitarios de ingeniería.', ubicacion: 'Tehuacán', fecha: '2026-08-07', usuario: 'Alan', categoria: 'Libros', icono: '📚' },
    { id: 5, titulo: 'Bicicleta de Montaña', descripcion: 'Rodada 26, necesita cambio de frenos.', ubicacion: 'Tehuacán', fecha: '2026-03-10', usuario: 'Sofia', categoria: 'Deportes', icono: '🚲' },
  ];

  // --- 2. LÓGICA DE ESTADOS Y EVENTOS ---
  const [donaciones, setDonaciones] = useState(allDonaciones);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todas');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const searchInputRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const handleSearch = () => {
    setIsLoading(true);
    setFeedback('Buscando resultados...');

    setTimeout(() => {
      const filtered = allDonaciones.filter(item => {
        const matchText = item.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = category === 'Todas' ? true : item.categoria === category;
        return matchText && matchCat;
      });

      setDonaciones(filtered);
      setIsLoading(false);
      setFeedback(filtered.length === 0 ? 'No se encontraron resultados.' : `Se encontraron ${filtered.length} resultados.`);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') {
      setSearchTerm('');
      setCategory('Todas');
      setDonaciones(allDonaciones);
      searchInputRef.current?.focus();
    }
  };

  // --- 3. RENDERIZADO CON ESTILO ---
  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#F9FAFB', // Fondo gris muy suave (hace resaltar las cards)
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>

      {/* Feedback Accesible (Oculto visualmente) */}
      <div role="status" aria-live="polite" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
        {feedback}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ENCABEZADO */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Donaciones Disponibles
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.05rem' }}>
            Explora los artículos que la comunidad está compartiendo hoy.
          </p>
        </div>

        {/* BARRA DE HERRAMIENTAS (Buscador + Filtro + Botón) */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>

          {/* Caja Blanca Unificada */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '6px 16px', // Padding interno cómodo
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            flex: 1, // Ocupa el espacio disponible
            minWidth: '300px',
            transition: reducedMotion ? 'none' : 'box-shadow 0.2s, border-color 0.2s'
          }}>

            {/* Sección INPUT */}
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <svg width="20" height="20" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '12px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar (ej. Laptop, Ropa)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  width: '100%',
                  color: '#111827',
                  height: '40px'
                }}
              />
            </div>

            {/* Separador Vertical Sutil */}
            <div style={{ width: '1px', height: '28px', backgroundColor: '#E5E7EB', margin: '0 16px' }}></div>

            {/* Sección SELECT */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" fill="none" stroke="#2563EB" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: '#374151',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minWidth: '140px'
                }}
              >
                <option value="Todas">Todas</option>
                <option value="Ropa">Ropa</option>
                <option value="Electrónicos">Electrónicos</option>
                <option value="Muebles">Muebles</option>
                <option value="Libros">Libros</option>
                <option value="Deportes">Deportes</option>
              </select>
            </div>
          </div>

          {/* BOTÓN DE BÚSQUEDA */}
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: '#2563EB', // Azul Revida
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0 28px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', // Sombra azulada suave
              transition: reducedMotion ? 'none' : 'background 0.2s',
              height: '54px' // Misma altura visual que la barra
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563EB'}
          >
            Buscar
          </button>
        </div>

        {/* --- GRID DE RESULTADOS --- */}
        {isLoading ? (
          <AccessibleLoader message="Buscando donaciones..." icon="donaciones" />
        ) : donaciones.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', // Tarjetas un poco más anchas
            gap: '30px'
          }}>
            {donaciones.map((item) => (
              <CardDonacion key={item.id} item={item} />
            ))}
          </div>
        ) : (
          // Estado Vacío Elegante
          <div style={{
            textAlign: 'center',
            padding: '60px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '2px dashed #E5E7EB',
            marginTop: '20px'
          }}>
            <p style={{ color: '#111827', fontWeight: '700', fontSize: '1.2rem', marginBottom: '8px' }}>
              No encontramos resultados
            </p>
            <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '20px' }}>
              Intenta buscar con otro término o cambia la categoría.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setCategory('Todas'); setDonaciones(allDonaciones); }}
              style={{
                color: '#2563EB',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                textDecoration: 'underline'
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}