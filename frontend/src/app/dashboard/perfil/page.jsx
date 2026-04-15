'use client';

import { useState } from 'react';
import useReducedMotion from '../../../hooks/useReducedMotion';

export default function PerfilPage() {
    const reducedMotion = useReducedMotion();
    const [isEditing, setIsEditing] = useState(false);
    
    // Datos iniciales de Alan
    const [perfil, setPerfil] = useState({
        nombre: 'Alan',
        email: 'alan@revida.com',
        ubicacion: 'Tehuacán, Centro',
        rol: 'Donador Activo'
    });

    return (
        <div style={{ padding: '40px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                
                {/* Título de la sección */}
                <header style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827' }}>Mi Perfil</h1>
                    <p style={{ color: '#6B7280' }}>Configura tu información y cómo te ven otros usuarios.</p>
                </header>

                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '16px', 
                    padding: '32px', 
                    border: '1px solid #E5E7EB', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
                }}>
                    {/* Header del Perfil con Avatar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', borderBottom: '1px solid #F3F4F6', paddingBottom: '24px' }}>
                        <div style={{ 
                            width: '90px', height: '90px', borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '2.5rem', fontWeight: 'bold'
                        }}>
                            {perfil.nombre.charAt(0)}
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#111827' }}>{perfil.nombre}</h2>
                            <span style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                                {perfil.rol}
                            </span>
                        </div>
                    </div>

                    {/* Formulario de Datos */}
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Nombre Público</label>
                                <input 
                                    type="text" 
                                    value={perfil.nombre} 
                                    disabled={!isEditing}
                                    style={isEditing ? inputActiveStyle : inputDisabledStyle}
                                    onChange={(e) => setPerfil({...perfil, nombre: e.target.value})}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    value={perfil.email} 
                                    disabled={true} // El email usualmente no se cambia por seguridad
                                    style={inputDisabledStyle}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Ciudad / Ubicación</label>
                            <input 
                                type="text" 
                                value={perfil.ubicacion} 
                                disabled={!isEditing}
                                style={isEditing ? inputActiveStyle : inputDisabledStyle}
                                onChange={(e) => setPerfil({...perfil, ubicacion: e.target.value})}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button 
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                                style={{
                                    backgroundColor: isEditing ? '#10B981' : '#111827',
                                    color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px',
                                    fontWeight: '600', cursor: 'pointer', transition: reducedMotion ? 'none' : '0.2s',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                            >
                                {isEditing ? '✓ Guardar Cambios' : '✎ Editar Perfil'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Estilos Reutilizables
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' };
const inputDisabledStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontSize: '1rem' };
const inputActiveStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #2563EB', outline: 'none', fontSize: '1rem', backgroundColor: 'white' };

