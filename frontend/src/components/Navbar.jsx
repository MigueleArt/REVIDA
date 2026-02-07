import Link from 'next/link';

export default function Navbar() {
  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #E5E7EB',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        <div style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 0',
          borderBottom: '1px solid #F3F4F6'
        }}>

          {/* Logo Revida */}
          <Link href="/" style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#2563EB">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563EB' }}>Revida</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

            <Link href="/auth/login" style={styles.logoutButton}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Login
            </Link>
          </div>
        </div>

        <div style={{ padding: '12px 0' }}>
          <nav style={{ display: 'flex', gap: '10px' }}>

            {/*  Donaciones  */}
            <Link href="/dashboard" style={styles.activeLink}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Donaciones
            </Link>

            {/* Donar */}
            <Link href="#" style={styles.inactiveLink}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Donar
            </Link>

            {/*  Mensajes */}
            <Link href="#" style={styles.inactiveLink}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Mensajes
            </Link>

            {/*  Solicitudes */}
            <Link href="/dashboard" style={styles.inactiveLink}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Solicitudes
            </Link>
          </nav>
        </div>

      </div>
    </header>
  );
}

const linkBase = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '0.95rem',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s'
};

const styles = {
  activeLink: {
    ...linkBase,
    color: '#6B7280',

  },
  inactiveLink: {
    ...linkBase,
    color: '#6B7280',
    backgroundColor: 'transparent',
  },
  logoutButton: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    color: '#4B5563',
    fontSize: '0.85rem',
    fontWeight: '500',
    backgroundColor: 'white'
  },

};