'use client';

import { useState, useEffect } from 'react';

/**
 * Hook que detecta si el usuario prefiere reducir las animaciones.
 * Respeta `prefers-reduced-motion: reduce` del sistema operativo.
 * Devuelve `true` si se deben minimizar las animaciones.
 */
export default function useReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(mq.matches);

        const handler = (e) => setReduced(e.matches);
        mq.addEventListener('change', handler);

        return () => mq.removeEventListener('change', handler);
    }, []);

    return reduced;
}
