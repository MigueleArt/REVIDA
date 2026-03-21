// ============================================================
// Capa de servicios — Consumo de API REST del Backend REVIDA
// ============================================================

const API_URL = "https://revida.onrender.com";

/** Obtener todos los usuarios  */
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

/** Obtener un usuario por ID */
export async function getUsuario(id) {
    try {
        const res = await fetch(`${API_URL}/api/usuarios/${id}`);
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || `Error ${res.status} al buscar usuario`);
        }
        return await res.json();
    } catch (err) {
        throw err;
    }
}

/** Crear un nuevo usuario */
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
        throw err;
    }
}

// ============================================================
// Autenticación — Manejo de sesión con SECURE COOKIES
// ============================================================

const MOCK_USERS = [
    { email: "admin@revida.com", password: "admin123", nombre: "Admin Revida", rol: "admin" },
    { email: "donador@revida.com", password: "donador123", nombre: "Donador Demo", rol: "donador" },
];

/** Iniciar sesión */
export async function loginUsuario(email, password) {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
        const userData = {
            token: "mock-jwt-" + Date.now(),
            nombre: user.nombre,
            rol: user.rol,
        };
        guardarSesion(userData);
        return userData;
    }
    throw new Error("Credenciales incorrectas. Verifique su correo y contraseña.");
}

/** Guardar sesión: Token en Cookie Segura, Usuario en LocalStorage */
function guardarSesion({ token, nombre, rol }) {
    if (typeof window === "undefined") return;

    // 1. Guardar TOKEN en Secure Cookie (Requisito de la actividad)
    document.cookie = `revida_token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;

    // 2. Guardar USUARIO en LocalStorage (Para que useAuth lo detecte y sincronice)
    localStorage.setItem("revida_usuario", JSON.stringify({ nombre, rol }));
    
    // Disparar evento para que otras pestañas se enteren
    window.dispatchEvent(new Event('storage'));
}

/** Obtener token de la Cookie */
export function getToken() {
    if (typeof window === "undefined") return null;
    const name = "revida_token=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return null;
}

/** Obtener datos del usuario */
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
    if (typeof window === "undefined") return;
    
    // Borrar Cookie
    document.cookie = "revida_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict; Secure";
    
    // Borrar LocalStorage
    localStorage.removeItem("revida_usuario");

    // Sincronizar cierre en otras pestañas
    window.dispatchEvent(new Event('storage'));
}