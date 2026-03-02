'use client';

/**
 * AccessibleLoader — Loader accesible y reutilizable para REVIDA.
 *
 * Props:
 *  - message  (string)  Texto visible debajo del spinner. Default: "Cargando..."
 *  - icon     (string)  Icono contextual: "donaciones" | "perfil" | "buscar" | "usuarios" | "general"
 *  - size     (string)  Tamaño del spinner: "sm" | "md" | "lg"
 *
 * Cuando prefers-reduced-motion: reduce está activo, se reemplaza el spinner
 * giratorio por un indicador pulsante estático accesible.
 */

import useReducedMotion from '../hooks/useReducedMotion';

const ICONS = {
    donaciones: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
    ),
    usuarios: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
    ),
    perfil: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    buscar: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
        </svg>
    ),
    general: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    ),
};

const SIZES = {
    sm: { spinner: 32, gap: '10px', fontSize: '0.9rem' },
    md: { spinner: 48, gap: '16px', fontSize: '1.05rem' },
    lg: { spinner: 64, gap: '20px', fontSize: '1.2rem' },
};

export default function AccessibleLoader({ message = 'Cargando...', icon = 'general', size = 'md' }) {
    const s = SIZES[size] || SIZES.md;
    const contextIcon = ICONS[icon] || ICONS.general;
    const reducedMotion = useReducedMotion();

    return (
        <div
            role="status"
            aria-live="polite"
            className="revida-loader"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: s.gap,
                padding: '60px 20px',
            }}
        >
            {reducedMotion ? (
                /* Modo reducido: indicador estático con texto pulsante */
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: s.gap
                }}>
                    <div style={{ opacity: 0.7 }}>{contextIcon}</div>
                    <p className="revida-pulse" style={{
                        color: '#2563EB',
                        fontSize: s.fontSize,
                        fontWeight: 600,
                        margin: 0,
                        textAlign: 'center'
                    }}>
                        {message}
                    </p>
                </div>
            ) : (
                /* Modo normal: spinner animado */
                <>
                    <div style={{ position: 'relative', width: s.spinner, height: s.spinner }}>
                        <svg
                            className="revida-spinner"
                            width={s.spinner}
                            height={s.spinner}
                            viewBox="0 0 50 50"
                            aria-hidden="true"
                            focusable="false"
                            style={{ position: 'absolute', top: 0, left: 0 }}
                        >
                            <circle cx="25" cy="25" r="20" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                            <circle cx="25" cy="25" r="20" fill="none" stroke="#2563EB" strokeWidth="4"
                                strokeLinecap="round" strokeDasharray="80, 200" strokeDashoffset="0" />
                        </svg>
                    </div>

                    {/* Icono contextual */}
                    <div style={{ opacity: 0.7 }}>{contextIcon}</div>

                    {/* Mensaje visible */}
                    <p style={{ color: '#6B7280', fontSize: s.fontSize, fontWeight: 500, margin: 0, textAlign: 'center' }}>
                        {message}
                    </p>
                </>
            )}

            {/* Texto solo para lectores de pantalla */}
            <span className="sr-only">{message}</span>
        </div>
    );
}
