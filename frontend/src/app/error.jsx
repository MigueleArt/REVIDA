'use client'; 

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }} role="main">
      <section aria-live="assertive" role="alert">
        <h1>500 - Algo salió mal</h1>
        <p>Tuvimos un problema en nuestro servidor. No es tu culpa.</p>
      </section>

      <div style={{ marginTop: '1rem' }}>
        <button 
          onClick={() => reset()} 
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Intentar de nuevo
        </button>
      </div>
    </main>
  );
}