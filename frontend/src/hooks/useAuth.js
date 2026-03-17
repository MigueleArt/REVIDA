'use client';

import { useState, useEffect, useCallback } from 'react';
import { getToken, getUsuarioSesion, logout as logoutService } from '../services/api';

/**
 * Hook para manejar la sesión del usuario.
 * Expone: usuario (nombre, rol), token, isAuthenticated, logout.
 */
export default function useAuth() {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = getToken();
        const u = getUsuarioSesion();
        setToken(t);
        setUsuario(u);
        setLoading(false);
    }, []);

    const logout = useCallback(() => {
        logoutService();
        setToken(null);
        setUsuario(null);
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
