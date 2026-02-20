// ============================================================
// Capa de servicios — Consumo de API REST del Backend REVIDA
// Base URL: http://localhost:3000
// ============================================================

const API_URL = "http://localhost:3000";

/**
 * GET /api/usuarios — Obtener todos los usuarios
 * @returns {{ success: boolean, data: Array<{id: number, nombre: string}> }}
 */
export async function getUsuarios() {
    try {
        const res = await fetch(`${API_URL}/api/usuarios`);
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || `Error ${res.status} al obtener usuarios`);
        }
        return await res.json();
    } catch (err) {
        if (err.name === "TypeError" && err.message.includes("fetch")) {
            throw new Error("No se pudo conectar con el servidor. ¿Está encendido el backend?");
        }
        throw err;
    }
}

/**
 * GET /api/usuarios/:id — Obtener un usuario por ID
 * @param {number} id
 * @returns {{ success: boolean, data: {id: number, nombre: string} }}
 */
export async function getUsuario(id) {
    try {
        const res = await fetch(`${API_URL}/api/usuarios/${id}`);
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || `Error ${res.status} al buscar usuario`);
        }
        return await res.json();
    } catch (err) {
        if (err.name === "TypeError" && err.message.includes("fetch")) {
            throw new Error("No se pudo conectar con el servidor. ¿Está encendido el backend?");
        }
        throw err;
    }
}

/**
 * POST /api/usuarios — Crear un nuevo usuario
 * @param {string} nombre
 * @returns {{ success: boolean, data: {id: number, nombre: string} }}
 */
export async function crearUsuario(nombre) {
    try {
        const res = await fetch(`${API_URL}/api/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre }),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || `Error ${res.status} al crear usuario`);
        }
        return await res.json();
    } catch (err) {
        if (err.name === "TypeError" && err.message.includes("fetch")) {
            throw new Error("No se pudo conectar con el servidor. ¿Está encendido el backend?");
        }
        throw err;
    }
}
