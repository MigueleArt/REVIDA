'use client';

import { useState, useEffect, useCallback } from 'react';
import { getToken, getUsuarioSesion, logout as logoutService } from '../services/api';

export default function useAuth() {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const cargarSesion = useCallback(() => {
        const t = getToken();
        const u = getUsuarioSesion();
        setToken(t);
        setUsuario(u);
        setLoading(false);
    }, []);

    useEffect(() => {
        cargarSesion();

        // Escuchamos el foco de la ventana para sincronizar cookies
        const sincronizarAlEnfocar = () => {
            cargarSesion();
        };

        window.addEventListener('focus', sincronizarAlEnfocar);
        return () => window.removeEventListener('focus', sincronizarAlEnfocar);
    }, [cargarSesion]);

    const logout = useCallback(() => {
        logoutService();
        setToken(null);
        setUsuario(null);
        // Forzamos un evento para que otras pestañas se enteren del logout
        window.dispatchEvent(new Event('storage'));
    }, []);

    return {
        usuario,
        rol: usuario?.rol || null,
        token,
        isAuthenticated: !!token && !!usuario,
        loading,
        logout,
    };
}
