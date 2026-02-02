import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenido a Revida</h1>
      <p>Tu plataforma de donaciones.</p>
      
      <div style={{ marginTop: '20px' }}>
        <Link href="/donaciones" style={{ color: 'blue', textDecoration: 'underline' }}>
          Ir a Donaciones
        </Link>
      </div>
    </div>
  );
}