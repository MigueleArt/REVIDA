import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }} role="main">
      <section aria-live="assertive" role="alert">
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
      </section>
      
      <nav aria-label="Navegación de error" style={{ marginTop: '1rem' }}>
        <Link href="/" style={{ textDecoration: 'underline', color: 'blue' }}>
          Volver al Inicio
        </Link>
      </nav>
    </main>
  );
}