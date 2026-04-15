'use client';

import { useState, useEffect, useRef } from 'react'; // Añadimos useEffect
import CardDonacion from '../../../components/CardDonacion';
import AccessibleLoader from '../../../components/AccessibleLoader';
import useReducedMotion from '../../../hooks/useReducedMotion';
import { getDonaciones } from '../../../services/api'; 

export default function MisDonativosPage() {
  // --- 1. ESTADOS REALES ---
  const [allDonaciones, setAllDonaciones] = useState([]); 
  const [donaciones, setDonaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  const searchInputRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // --- 2. CARGA DE DATOS 
  useEffect(() => {
    async function cargarDonaciones() {
      try {
        setIsLoading(true);
        const data = await getDonaciones();
        setAllDonaciones(data);
        setDonaciones(data);
        setFeedback(data.length === 0 ? 'No hay donaciones disponibles.' : 'Donaciones cargadas correctamente.');
      } catch (error) {
        console.error("Error al conectar con la API:", error);
        setFeedback('Error al cargar datos del servidor.');
      } finally {
        setIsLoading(false);
      }
    }
    cargarDonaciones();
  }, []);

  // --- 3. LÓGICA DE BÚSQUEDA 
  const handleSearch = () => {
    setIsLoading(true);
    setFeedback('Buscando resultados...');

    setTimeout(() => {
      const filtered = allDonaciones.filter(item => {
        const matchText = item.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = category === 'Todas' ? true : item.categoria === category;
        return matchText && matchCat;
      });

      setDonaciones(filtered);
      setIsLoading(false);
      setFeedback(filtered.length === 0 ? 'No se encontraron resultados.' : `Se encontraron ${filtered.length} resultados.`);
    }, 300);
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

  return (
    <div style={{ padding: '40px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Feedback Accesible para lectores de pantalla */}
      <div role="status" aria-live="polite" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
        {feedback}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ENCABEZADO */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
            Donaciones Disponibles
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.05rem' }}>
            Explora los artículos reales de la base de datos de <strong>Revida</strong>.
          </p>
        </div>

        {/* BARRA DE HERRAMIENTAS (Accesibilidad mejorada con aria-labels) */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', backgroundColor: 'white',
            border: '1px solid #E5E7EB', borderRadius: '12px', padding: '6px 16px', flex: 1, minWidth: '300px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <svg width="20" height="20" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '12px' }}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                aria-label="Buscar donaciones por nombre" // ACCESIBILIDAD
                placeholder="Buscar (ej. Laptop, Ropa)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ border: 'none', outline: 'none', fontSize: '1rem', width: '100%', color: '#111827', height: '40px' }}
              />
            </div>

            <div style={{ width: '1px', height: '28px', backgroundColor: '#E5E7EB', margin: '0 16px' }}></div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <select
                aria-label="Filtrar por categoría" // ACCESIBILIDAD
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', color: '#374151', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', minWidth: '140px' }}
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

          <button
            onClick={handleSearch}
            aria-label="Ejecutar búsqueda" // ACCESIBILIDAD
            style={{
              backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '12px',
              padding: '0 28px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', height: '54px'
            }}
          >
            Buscar
          </button>
        </div>

        {/* --- GRID DE RESULTADOS REALES --- */}
        {isLoading ? (
          <AccessibleLoader message="Conectando con el servidor de Revida..." icon="donaciones" />
        ) : donaciones.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {donaciones.map((item) => (
              <CardDonacion key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '2px dashed #E5E7EB' }}>
            <p style={{ color: '#111827', fontWeight: '700', fontSize: '1.2rem' }}>
              Sin donaciones reales
            </p>
            <p style={{ color: '#6B7280' }}>La base de datos está vacía o no hay coincidencias.</p>
          </div>
        )}
      </div>
    </div>
  );
}