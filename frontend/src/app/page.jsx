'use client';

import Link from "next/link";
import useReducedMotion from "../hooks/useReducedMotion";

export default function HomePage() {
  const reducedMotion = useReducedMotion();

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

        <Link href="/dashboard/mis-donativos" className="btn-primary" style={{ marginTop: 0 }}>
          Explorar Donaciones
        </Link>

        <Link href="/dashboard" style={{
          padding: '10px 20px',
          border: '2px solid #2563EB',
          color: '#2563EB',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: reducedMotion ? 'none' : 'background 0.2s'
        }}>
          Ir al Dashboard
        </Link>

      </div>
    </div>
  );
}
