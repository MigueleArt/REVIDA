'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../../hooks/useAuth';
import { publicarDonacion } from '../../../services/api';
import AccessibleLoader from '../../../components/AccessibleLoader';

export default function PublicarPage() {
    const { usuario } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef(null); // Referencia para el input de archivo

    // --- ESTADOS ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // Para mostrar la foto antes de subirla

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        categoria: 'Muebles',
        condicion: 'Bueno',
        ubicacion: '',
        imagen: null // Aquí guardaremos el archivo binario
    });

    // --- MANEJADORES ---

    // 1. Manejar el cambio de archivo (con previsualización)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Guardar el archivo real para enviarlo
            setFormData({...formData, imagen: file});
            
            // Crear una URL temporal para mostrar la previsualización
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 2. Enviar el formulario real
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Verificación básica
        if (!usuario) {
            setError("Debes estar autenticado para publicar.");
            setLoading(false);
            return;
        }

        try {
            // Preparamos los datos incluyendo el ID de Alan
            const datosFinales = {
                ...formData,
                usuarioId: usuario.id || usuario._id
            };

            // Llamada a la API (Paso 1)
            await publicarDonacion(datosFinales);

            // Éxito: Redirigir al dashboard para ver la nueva donación
            router.push('/dashboard');
            router.refresh(); // Forzar recarga de datos
        } catch (err) {
            console.error("Error al publicar:", err);
            setError(err.message || "No se pudo conectar con el servidor en Render.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <AccessibleLoader message="Subiendo tu donación y procesando la imagen..." />
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '850px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
            
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Publicar Donación</h1>
                <p style={{ color: '#6B7280', fontSize: '1.1rem', margin: 0 }}>Esta información se guardará directamente en la base de datos real.</p>
            </header>

            {error && (
                <div role="alert" style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #F87171', fontWeight: '500' }}>
                    ⚠️ Error: {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                
                {/* COLUMNA IZQUIERDA: DATOS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                        <label style={labelStyle}>Título del Artículo *</label>
                        <input 
                            type="text" required placeholder="Ej. Cama Matrimonial, Laptop..."
                            style={inputStyle}
                            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                        />
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                        <label style={labelStyle}>Descripción Detallada *</label>
                        <textarea 
                            required rows="6" style={inputStyle}
                            placeholder="Describe el estado, medidas, o cualquier detalle importante..."
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                            <label style={labelStyle}>Categoría</label>
                            <select style={inputStyle} value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})}>
                                <option value="Muebles">Muebles</option>
                                <option value="Electrónicos">Electrónicos</option>
                                <option value="Ropa">Ropa</option>
                                <option value="Libros">Libros</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                            <label style={labelStyle}>Condición</label>
                            <select style={inputStyle} value={formData.condicion} onChange={(e) => setFormData({...formData, condicion: e.target.value})}>
                                <option value="Nuevo">Nuevo</option>
                                <option value="Bueno">Bueno (Poco uso)</option>
                                <option value="Usado">Usado (Funcional)</option>
                                <option value="Para Reparar">Para Reparar</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: FOTO Y UBICACIÓN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* SECCIÓN DE FOTO */}
                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB', textAlign: 'center' }}>
                        <label style={{...labelStyle, textAlign: 'left'}}>Foto del Artículo</label>
                        
                        {/* Input oculto */}
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange} 
                        />

                        {/* Área de previsualización / clic */}
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                width: '100%', height: '250px', borderRadius: '12px', border: '2px dashed #D1D5DB',
                                backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', overflow: 'hidden', marginBottom: '16px', transition: '0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = '#2563EB'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Previsualización" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: '8px' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 002.25 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                    </svg>
                                    <p style={{margin: 0, fontWeight: '600'}}>Haz clic para subir foto</p>
                                    <p style={{margin: '4px 0 0 0', fontSize: '0.8rem'}}>PNG, JPG o WEBP</p>
                                </div>
                            )}
                        </div>
                        {previewUrl && (
                            <button type="button" onClick={() => { setPreviewUrl(null); setFormData({...formData, imagen: null}); }} style={{color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem'}}>
                                Eliminar foto
                            </button>
                        )}
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                        <label style={labelStyle}>Ubicación / Zona de Entrega *</label>
                        <input 
                            type="text" required placeholder="Ej. Tehuacán Centro o Colonia..."
                            style={inputStyle}
                            onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                        />
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button type="button" onClick={() => router.back()} style={btnSecundarioStyle}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} style={btnPrimarioStyle}>
                            {loading ? 'Publicando...' : 'Publicar'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

// --- ESTILOS REUTILIZABLES (Tailwind-like) ---
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '0.95rem' };
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none', transition: 'border 0.2s' };
const btnPrimarioStyle = { backgroundColor: '#2563EB', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)', transition: '0.2s' };
const btnSecundarioStyle = { backgroundColor: 'white', color: '#374151', border: '1px solid #D1D5DB', padding: '14px 28px', borderRadius: '12px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' };

