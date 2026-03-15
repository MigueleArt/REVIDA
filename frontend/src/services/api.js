// ============================================================
// Capa de servicios — Consumo de API REST del Backend REVIDA
// Base URL: https://revida.onrender.com
// ============================================================

const API_URL = "https://revida.onrender.com";

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

// ============================================================
// Autenticación — Login y manejo de sesión
// ============================================================

// --- MOCK TEMPORAL (eliminar cuando el backend implemente POST /api/auth/login) ---
const MOCK_USERS = [
    { email: "admin@revida.com", password: "admin123", nombre: "Admin Revida", rol: "admin" },
    { email: "donador@revida.com", password: "donador123", nombre: "Donador Demo", rol: "donador" },
];

function mockLogin(email, password) {
    const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
    );
    if (!user) return null;
    return {
        token: "mock-jwt-" + Date.now(),
        nombre: user.nombre,
        rol: user.rol,
    };
}
// --- FIN MOCK ---

/**
 * POST /api/auth/login — Iniciar sesión
 * @param {string} email
 * @param {string} password
 * @returns {{ token: string, nombre: string, rol: string }}
 */
export async function loginUsuario(email, password) {
    // --- MOCK: reemplazar este bloque por el fetch real ---
    const mockResult = mockLogin(email, password);
    if (mockResult) {
        guardarSesion(mockResult);
        return mockResult;
    }
    throw new Error("Credenciales incorrectas. Verifique su correo y contraseña.");
    // --- FIN MOCK ---

    // --- CÓDIGO REAL (descomentar cuando el backend esté listo) ---
    // try {
    //     const res = await fetch(`${API_URL}/api/auth/login`, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ email, password }),
    //     });
    //     if (!res.ok) {
    //         throw new Error("Credenciales incorrectas. Verifique su correo y contraseña.");
    //     }
    //     const data = await res.json();
    //     guardarSesion(data);
    //     return data;
    // } catch (err) {
    //     if (err.name === "TypeError" && err.message.includes("fetch")) {
    //         throw new Error("No se pudo conectar con el servidor.");
    //     }
    //     throw err;
    // }
}

/** Guardar sesión en localStorage */
function guardarSesion({ token, nombre, rol }) {
    localStorage.setItem("revida_token", token);
    localStorage.setItem("revida_usuario", JSON.stringify({ nombre, rol }));
}

/** Obtener token de sesión */
export function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("revida_token");
}

/** Obtener datos del usuario con sesión activa */
export function getUsuarioSesion() {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("revida_usuario");
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/** Cerrar sesión */
export function logout() {
    localStorage.removeItem("revida_token");
    localStorage.removeItem("revida_usuario");
}
