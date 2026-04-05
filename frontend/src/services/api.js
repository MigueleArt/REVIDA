// ============================================================
// Capa de servicios — CONEXIÓN REAL BACKEND REVIDA
// ============================================================



const API_URL = "https://revida.onrender.com";

/** 1. RECUPERAR CONTRASEÑA  */
export async function solicitarRecuperacion(email) {
    if (!email || !email.includes('@')) {
        throw new Error("Por favor, ingresa un correo electrónico válido.");
    }
    const res = await fetch(`${API_URL}/api/recuperar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al procesar la solicitud.");
    return data;
}

/** 2. LOGIN REAL */
export async function loginUsuario(email, password) {
    const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Credenciales incorrectas.");
    if (data.success) {
        // Guardamos el usuario que viene del backend real
        localStorage.setItem("revida_usuario", JSON.stringify(data.datos));
        window.dispatchEvent(new Event('storage'));
    }
    return data;
}

/** 3. LOGOUT REAL */
export async function logout() {
    if (typeof window === "undefined") return;
    
    try {
        await fetch(`${API_URL}/api/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Importante para enviar la cookie
        });
    } catch (e) {
        console.error("Error al hacer logout en el backend:", e);
    }

    // Limpiamos los datos locales
    localStorage.removeItem("revida_usuario");
    // Borramos la cookie del token manualemente, aunque el backend también indique su expiración con HttpOnly
    document.cookie = "revida_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict; Secure";
    
    // Avisamos al sistema del cambio
    window.dispatchEvent(new Event('storage'));
    
    // Redirigimos al login
    window.location.href = '/auth/login';
}

/** 4. VALIDAR SESION EN EL SERVIDOR (Multi-pestaña y caducidad) */
export async function validateSession() {
    try {
        const res = await fetch(`${API_URL}/api/validate-session`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        const data = await res.json();
        return { ok: res.ok, data };
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

/** 5. FUNCIONES DE APOYO (Para useAuth y Navbar) */
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

export function getUsuarioSesion() {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("revida_usuario");
    if (!data) return null;
    try { return JSON.parse(data); } catch { return null; }
}

/** 6. GESTIÓN DE USUARIOS (CRUD Básico) */
export async function getUsuarios() {
    const res = await fetch(`${API_URL}/api/usuarios`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al obtener usuarios");
    return data;
}

export async function getUsuario(id) {
    const res = await fetch(`${API_URL}/api/usuarios/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `El usuario con ID ${id} no existe`);
    return data;
}

/** 6. REGISTRO DE NUEVO USUARIO */
export async function registrarUsuario(nombre, email, password) {
    const res = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, rol: 'Donante' }), // Asignamos un rol por defecto
    });
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.message || "Error al crear la cuenta. Intenta con otro correo.");
    }
    return data;
}
