import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="center-screen" role="main">
      <section aria-live="assertive">
        <h1 className="title-blue">404</h1>
        <h2>Página no encontrada</h2>
        <p style={{ color: '#666', maxWidth: '400px' }}>
          Lo sentimos, no pudimos encontrar lo que buscabas.
        </p>
      </section>
      
      <Link href="/" className="btn-primary">
        Volver al Inicio
      </Link>
    </main>
  );
}