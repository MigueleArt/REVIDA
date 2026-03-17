'use client';

import ProtectedRoute from '../../components/ProtectedRoute';

/**
 * Layout protegido para /dashboard/*
 * Todas las rutas bajo /dashboard requieren autenticación.
 */
export default function DashboardLayout({ children }) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}
