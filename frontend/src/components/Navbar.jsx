import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#2563EB' }}>
        Revida
      </div>

      <ul className="nav-links">
        <li><Link href="/" className="nav-link">Inicio</Link></li>
        <li><Link href="/donaciones" className="nav-link">Donaciones</Link></li>
        <li><Link href="/dashboard" className="nav-link">Dashboard</Link></li>
      </ul>
    </nav>
  );
}