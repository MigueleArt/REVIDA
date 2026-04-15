'use client';

export default function Footer() {
  return (
    <footer 
      role="contentinfo" 
      style={{
        backgroundColor: 'white',
        borderTop: '1px solid #E5E7EB',
        padding: '20px 0',
        marginTop: 'auto',
        textAlign: 'center',
        width: '100%'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: 0 }}>
          © {new Date().getFullYear()} <strong>Revida</strong>. Proyecto de Economía Circular.
        </p>
        <nav aria-label="Enlaces legales" style={{ marginTop: '10px' }}>
          <ul style={{ 
            listStyle: 'none', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            padding: 0, 
            fontSize: '0.85rem' 
          }}>
            <li><a href="#" style={{ color: '#2563EB', textDecoration: 'none' }}>Privacidad</a></li>
            <li><a href="#" style={{ color: '#2563EB', textDecoration: 'none' }}>Términos</a></li>
            <li><a href="#" style={{ color: '#2563EB', textDecoration: 'none' }}>Contacto</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}