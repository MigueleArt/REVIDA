'use client';

import { useState, useRef } from 'react';

export default function SearchFilter({ onSearch }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('todas');
  const [isFocused, setIsFocused] = useState(false); 
  const inputRef = useRef(null);

  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.focus(); 
    }
  };

  const handleSearch = () => {
    onSearch(query, category);
  };

  return (
    <div style={{ 
      marginBottom: '2rem', 
      padding: '20px', 
      backgroundColor: 'white', 
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <label 
        htmlFor="search-input" 
        style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}
      >
        Buscar donaciones
      </label>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ej. Ropa, Medicinas..."
            aria-describedby="search-hint"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: isFocused ? '2px solid #2563EB' : '1px solid #D1D5DB', 
              outline: 'none',
              transition: 'border 0.2s',
              fontSize: '1rem'
            }}
          />
          <span id="search-hint" style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '4px', display: 'block' }}>
            Presiona Enter para buscar, Esc para limpiar.
          </span>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filtrar por categoría"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          <option value="todas">Todas las categorías</option>
          <option value="ropa">Ropa</option>
          <option value="alimentos">Alimentos</option>
          <option value="salud">Salud</option>
        </select>

        <button
          onClick={handleSearch}
          style={{
            backgroundColor: '#2563EB',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Buscar
        </button>
      </div>
    </div>
  );
}