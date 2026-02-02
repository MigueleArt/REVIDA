"use client"
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        backgroundColor: 'white', 
        borderBottom: '1px solid #ccc',
        padding: '1rem'
      }}
    >
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0 }}>
        <li><Link href="/">Inico</Link></li>
        <li><Link href="/dashboard">Donaciones</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
      </ul>
    </nav>
  );  
}