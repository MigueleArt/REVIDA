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

export async function crearUsuario(nombre) {
    const res = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
    });
    const data = await res.json();
    if (!res.ok) {
        if (data.message && data.message.includes('obligatorio')) {
            throw new Error("El campo 'nombre' es obligatorio");
        }
        throw new Error(data.message || "Error al crear usuario");
    }
    return data;
}

/** 7. GESTIÓN DE MENSAJES */
export async function getChats() {
    const res = await fetch(`${API_URL}/api/mensajes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al obtener los mensajes");
    return data; // Se espera que el backend devuelva el array de chats
}

/** 8. GESTIÓN DE DONACIONES */
export async function getDonaciones() {
    const res = await fetch(`${API_URL}/api/donaciones`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al obtener donaciones");
    return data;
}

export async function crearDonacion(formData) {
    const res = await fetch(`${API_URL}/api/donaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al publicar donación");
    return data;
}

export async function publicarDonacion(datosFormulario) {
  // 1. Creamos el contenedor especial para archivos y texto
  const dataToSend = new FormData();
  
  // 2. Agregamos los campos de texto normales
  dataToSend.append('titulo', datosFormulario.titulo);
  dataToSend.append('descripcion', datosFormulario.descripcion);
  dataToSend.append('categoria', datosFormulario.categoria);
  dataToSend.append('condicion', datosFormulario.condicion);
  dataToSend.append('ubicacion', datosFormulario.ubicacion);
  dataToSend.append('usuarioId', datosFormulario.usuarioId);

  // 3. Agregamos la imagen SOLO si el usuario seleccionó una
  if (datosFormulario.imagen) {
    // 'imagen' es el nombre del campo que espera tu backend (Multer)
    dataToSend.append('imagen', datosFormulario.imagen);
  }

  // 4. Hacemos la petición real
  const res = await fetch(`${API_URL}/api/donaciones`, {
    method: "POST",
    // IMPORTANTE: Al usar FormData, NO definas 'Content-Type'. 
    // El navegador lo hace automáticamente e incluye el boundary necesario.
    credentials: "include", // Si usas cookies/sesiones
    body: dataToSend,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al publicar en el servidor.");
  }

  return await res.json();
}




