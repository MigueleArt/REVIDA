'use client';

import { useState, useEffect } from 'react';
import { getUsuarios, crearUsuario } from '../../../services/api';
import AccessibleLoader from '../../../components/AccessibleLoader';
import useReducedMotion from '../../../hooks/useReducedMotion';

export default function UsuariosPage() {
    // --- ESTADOS ---
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nombre, setNombre] = useState('');
    const [isCreando, setIsCreando] = useState(false);
    const [feedback, setFeedback] = useState('');
    const reducedMotion = useReducedMotion();

    // --- CARGAR USUARIOS AL MONTAR ---
    const cargarUsuarios = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await getUsuarios();
            setUsuarios(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // --- CREAR USUARIO ---
    const handleCrear = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;

        setIsCreando(true);
        setFeedback('');
        try {
            const res = await crearUsuario(nombre.trim());
            setUsuarios(prev => [...prev, res.data]);
            setNombre('');
            setFeedback(`✅ Usuario "${res.data.nombre}" creado exitosamente`);
        } catch (err) {
            setFeedback(`❌ ${err.message}`);
        } finally {
            setIsCreando(false);
        }
    };

    // --- RENDERIZADO ---
    return (
        <div style={{
            padding: '40px',
            backgroundColor: '#F9FAFB',
            minHeight: '100vh',
            fontFamily: 'system-ui, sans-serif'
        }}>
            {/* Feedback accesible */}
            <div role="status" aria-live="polite" className="sr-only">{feedback}</div>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* ENCABEZADO */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                        Usuarios del Sistema
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: '1.05rem' }}>
                        Datos en tiempo real desde el backend (<code style={{ backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '0.9rem' }}>GET /api/usuarios</code>)
                    </p>
                </div>

                {/* FORMULARIO CREAR USUARIO */}
                <form onSubmit={handleCrear} style={{
                    display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap'
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', backgroundColor: 'white',
                        border: '1px solid #E5E7EB', borderRadius: '12px', padding: '6px 16px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)', flex: 1, minWidth: '250px'
                    }}>
                        {/* Icono de usuario */}
                        <svg width="20" height="20" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '12px' }} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Nombre del nuevo usuario..."
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            aria-label="Nombre del nuevo usuario"
                            style={{
                                border: 'none', outline: 'none', fontSize: '1rem',
                                width: '100%', color: '#111827', height: '40px'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isCreando || !nombre.trim()}
                        style={{
                            backgroundColor: isCreando ? '#93C5FD' : '#2563EB',
                            color: 'white', border: 'none', borderRadius: '12px',
                            padding: '0 28px', fontWeight: '600', fontSize: '1rem',
                            cursor: isCreando ? 'wait' : 'pointer',
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                            transition: reducedMotion ? 'none' : 'background 0.2s', height: '54px',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        {isCreando ? (
                            <>
                                <svg className="revida-spinner" width="18" height="18" viewBox="0 0 50 50" aria-hidden="true">
                                    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                                    <circle cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="4"
                                        strokeLinecap="round" strokeDasharray="80, 200" />
                                </svg>
                                Creando...
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Crear Usuario
                            </>
                        )}
                    </button>
                </form>

                {/* Feedback visible */}
                {feedback && (
                    <div role="alert" style={{
                        padding: '12px 16px', borderRadius: '10px', marginBottom: '24px',
                        backgroundColor: feedback.startsWith('✅') ? '#F0FDF4' : '#FEF2F2',
                        color: feedback.startsWith('✅') ? '#166534' : '#991B1B',
                        border: `1px solid ${feedback.startsWith('✅') ? '#BBF7D0' : '#FECACA'}`,
                        fontSize: '0.95rem', fontWeight: '500'
                    }}>
                        {feedback}
                    </div>
                )}

                {/* CONTENIDO PRINCIPAL */}
                {isLoading ? (
                    <AccessibleLoader message="Cargando usuarios desde el servidor..." icon="usuarios" />
                ) : error ? (
                    /* Estado de Error */
                    <div role="alert" style={{
                        textAlign: 'center', padding: '60px', backgroundColor: 'white',
                        borderRadius: '16px', border: '2px dashed #FECACA'
                    }}>
                        <svg width="48" height="48" fill="none" stroke="#EF4444" strokeWidth="1.5" viewBox="0 0 24 24"
                            style={{ margin: '0 auto 16px' }} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <p style={{ color: '#991B1B', fontWeight: '700', fontSize: '1.2rem', marginBottom: '8px' }}>
                            Error de conexión
                        </p>
                        <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>
                            {error}
                        </p>
                        <button
                            onClick={cargarUsuarios}
                            style={{
                                backgroundColor: '#2563EB', color: 'white', border: 'none',
                                borderRadius: '8px', padding: '10px 24px', fontWeight: '600',
                                fontSize: '0.95rem', cursor: 'pointer', transition: reducedMotion ? 'none' : 'background 0.2s'
                            }}
                        >
                            Reintentar
                        </button>
                    </div>
                ) : usuarios.length > 0 ? (
                    /* Lista de usuarios */
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '20px'
                    }}>
                        {usuarios.map((user) => (
                            <div key={user.id} style={{
                                backgroundColor: 'white', borderRadius: '12px', padding: '24px',
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                display: 'flex', alignItems: 'center', gap: '16px',
                                transition: reducedMotion ? 'none' : 'transform 0.2s, box-shadow 0.2s'
                            }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: '700', fontSize: '1.2rem', flexShrink: 0
                                }}>
                                    {user.nombre.charAt(0).toUpperCase()}
                                </div>
                                {/* Info */}
                                <div>
                                    <p style={{ margin: 0, fontWeight: '700', color: '#111827', fontSize: '1.05rem' }}>
                                        {user.nombre}
                                    </p>
                                    <p style={{ margin: '4px 0 0', color: '#9CA3AF', fontSize: '0.85rem' }}>
                                        ID: {user.id}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Estado vacío */
                    <div style={{
                        textAlign: 'center', padding: '60px', backgroundColor: 'white',
                        borderRadius: '16px', border: '2px dashed #E5E7EB'
                    }}>
                        <p style={{ color: '#111827', fontWeight: '700', fontSize: '1.2rem', marginBottom: '8px' }}>
                            No hay usuarios registrados
                        </p>
                        <p style={{ color: '#6B7280', fontSize: '1rem' }}>
                            Usa el formulario de arriba para crear el primero.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
