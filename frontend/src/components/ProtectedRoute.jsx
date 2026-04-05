'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth';
import AccessibleLoader from './AccessibleLoader';

/**
 * Componente que protege rutas según autenticación y rol.
 *
 * Props:
 * - allowedRoles: string[] — Roles permitidos (ej: ['admin']). Si es vacío, cualquier rol autenticado pasa.
 * - children: ReactNode
 */
export default function ProtectedRoute({ allowedRoles = [], children }) {
    const { isAuthenticated, rol, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            router.replace('/auth/login');
            return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(rol)) {
            // Redirigir al panel por defecto según su rol
            const defaultRoute = (rol === 'admin' || rol === 'Administrador')
                ? '/dashboard/usuarios'
                : '/dashboard/mis-donativos';
            router.replace(defaultRoute);
        }
    }, [isAuthenticated, rol, loading, allowedRoles, router]);

    if (loading) {
        return <AccessibleLoader message="Verificando sesión..." icon="usuarios" />;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(rol)) {
        return null;
    }

    return <>{children}</>;
}
