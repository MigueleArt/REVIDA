import Link from "next/link";

export default function HomePage() {
  return (
    <div className="center-screen">
      
      <h1 className="title-blue">Bienvenido a Revida</h1>
      
      <p style={{ 
        color: '#64748B', 
        fontSize: '1.2rem', 
        maxWidth: '600px', 
        lineHeight: '1.5',
        marginBottom: '2rem' 
      }}>
        Tu plataforma de donaciones. Conectamos a quienes tienen con quienes necesitan.
      </p>
      
      <div style={{ display: 'flex', gap: '15px' }}>

        {/*login*/}
        <Link href="/auth/login" className="btn-primary" style={{ marginTop: 0 }}>
          Iniciar Sesión
        </Link>
       
        <Link href="/donaciones" className="btn-primary" style={{ marginTop: 0 }}>
          Explorar Donaciones
        </Link>

        <Link href="/dashboard" style={{ 
          padding: '10px 20px',
          border: '2px solid #2563EB',
          color: '#2563EB',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'background 0.2s'
        }}>
          Ir al Dashboard
        </Link>

      </div>
    </div>
  );
}