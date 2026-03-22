import http from "http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "revida_super_secreto";
const PORT = 3001;

const hashTemporal = bcrypt.hashSync("123456", 10);

let usuarios = [
  { id: 1, nombre: "Alan", email: "admin@revida.com", password: hashTemporal, rol: "Administrador" },
  { id: 2, nombre: "Miguel", email: "org@revida.com", password: hashTemporal, rol: "Organizacion" },
  { id: 3, nombre: "Fatima", email: "donador@revida.com", password: hashTemporal, rol: "Donador" }
];

// Estructura en memoria para controlar sesiones activas
const activeSessions = new Map();

// Helper para extraer cookies de la petición HTTP nativa
function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(";").forEach(cookie => {
    let [name, ...rest] = cookie.split("=");
    name = name?.trim();
    if (!name) return;
    const value = rest.join("=").trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });
  return list;
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    // Configuración CORS ajustada para permitir credenciales (cookies)
    "Access-Control-Allow-Origin": "http://localhost:3000", 
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true"
  });
  res.end(JSON.stringify(data));
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  if (method === "GET" && url === "/") {
    return sendJson(res, 200, { message: "Revida Backend Activo" });
  }

  if (method === "GET" && url === "/error-test") {
    await delay(200);
    return sendJson(res, 500, { success: false, message: "Error interno del servidor" });
  }

  if (method === "GET" && url === "/api/usuarios") {
    await delay(200); 
    return sendJson(res, 200, { success: true, data: usuarios });
  }

  if (method === "GET" && url.startsWith("/api/usuarios/")) {
    const id = parseInt(url.split("/")[3]);
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
      return sendJson(res, 404, { success: false, message: "El usuario no existe" });
    }
    return sendJson(res, 200, { success: true, data: usuario });
  }

  if (method === "POST" && url === "/api/usuarios") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        if (!data.nombre) {
          return sendJson(res, 400, { success: false, message: "Falta el nombre" });
        }
        const nuevoUsuario = { id: usuarios.length + 1, nombre: data.nombre };
        usuarios.push(nuevoUsuario);
        return sendJson(res, 201, { success: true, data: nuevoUsuario });
      } catch (err) {
        return sendJson(res, 400, { success: false, message: "JSON inválido" });
      }
    });
    return;
  }

  // Endpoint de Login Modificado para Multisesión
  if (method === "POST" && url === "/api/login") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { email, password } = JSON.parse(body);

        const usuario = usuarios.find(u => u.email === email);
        if (!usuario) {
          return sendJson(res, 401, { success: false, message: "Correo o contraseña incorrectos" });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
          return sendJson(res, 401, { success: false, message: "Correo o contraseña incorrectos" });
        }

        // Validación de multisesión (Requisito del Frontend: 409)
        if (activeSessions.has(usuario.id)) {
          return sendJson(res, 409, { 
            success: false, 
            message: "Ya hay una sesión activa en otro dispositivo. Por favor, cierra la anterior." 
          });
        }

        const token = jwt.sign(
          { id: usuario.id, rol: usuario.rol },
          SECRET_KEY,
          { expiresIn: "2h" }
        );

        // Registrar la sesión en memoria
        activeSessions.set(usuario.id, {
          token: token,
          expiresAt: Date.now() + 2 * 60 * 60 * 1000
        });

        // Configurar cookie con el nombre exacto que espera el frontend
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Set-Cookie": `revida_token=${token}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": "true"
        });
        
        res.end(JSON.stringify({
          success: true,
          message: "Login exitoso",
          datos: { nombre: usuario.nombre, rol: usuario.rol }
        }));

      } catch (err) {
        return sendJson(res, 400, { success: false, message: "Error al procesar el login" });
      }
    });
    return;
  }

  // Nuevo Endpoint: Cerrar Sesión
  if (method === "POST" && url === "/api/logout") {
    const cookies = parseCookies(req);
    const token = cookies.revida_token;

    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        activeSessions.delete(decoded.id);
      } catch (error) {
        // Ignorar si el token ya expiró
      }
    }

    // Sobrescribir la cookie con una fecha expirada para borrarla del navegador
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Set-Cookie": `revida_token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`,
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": "true"
    });
    
    res.end(JSON.stringify({ success: true, message: "Sesión cerrada" }));
    return;
  }

  // Nuevo Endpoint: Validar Sesión (Para sincronización de pestañas del FE)
  if (method === "GET" && url === "/api/validate-session") {
    const cookies = parseCookies(req);
    const token = cookies.revida_token;

    if (!token) {
      return sendJson(res, 401, { success: false, message: "No hay sesión activa" });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const sessionActiva = activeSessions.get(decoded.id);

      if (!sessionActiva || sessionActiva.token !== token) {
        return sendJson(res, 401, { success: false, message: "Sesión invalidada" });
      }

      return sendJson(res, 200, { success: true, user: decoded });
    } catch (error) {
      return sendJson(res, 401, { success: false, message: "Token inválido" });
    }
  }

  return sendJson(res, 404, { success: false, message: `La ruta solicitada (${url}) no existe` });
});

server.listen(PORT, () => {
  console.log(`Servidor REVIDA corriendo en http://localhost:${PORT}`);
});