import http from "http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "revida_super_secreto"; // En producción iría en un .env
const PORT = 3001;

// Encriptamos la contraseña "123456" para todos
const hashTemporal = bcrypt.hashSync("123456", 10);

let usuarios = [
  { id: 1, nombre: "Alan", email: "admin@revida.com", password: hashTemporal, rol: "Administrador" },
  { id: 2, nombre: "Miguel", email: "org@revida.com", password: hashTemporal, rol: "Organizacion" },
  { id: 3, nombre: "Fatima", email: "donador@revida.com", password: hashTemporal, rol: "Donador" }
];

// Estructura en memoria para controlar sesiones concurrentes
export const activeSessions = new Map();

// Helper para extraer cookies
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

// Helper para responder en JSON con CORS habilitado para Cookies
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000", // URL del Frontend
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true"
  });
  res.end(JSON.stringify(data));
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Manejo de pre-flight requests de CORS
  if (method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  if (method === "GET" && url === "/") {
    return sendJson(res, 200, { message: "Revida Backend Activo" });
  }

  if (method === "GET" && url === "/api/usuarios") {
    await delay(200); 
    return sendJson(res, 200, { success: true, data: usuarios });
  }

  // ENDPOINT: LOGIN MULTISESIÓN (1 Hora de caducidad)
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

        // TAREA: Control de Multisesiones (Requisito 409 para el Frontend)
        if (activeSessions.has(usuario.id)) {
          const sesionActual = activeSessions.get(usuario.id);
          
          if (sesionActual.expiresAt > Date.now()) {
            // La sesión vieja aún vive, bloqueamos el nuevo login
            return sendJson(res, 409, { 
              success: false, 
              message: "Ya hay una sesión activa en otro dispositivo. Por favor, cierra la anterior." 
            });
          } else {
            // La sesión expiró, limpiamos el mapa
            activeSessions.delete(usuario.id);
          }
        }

        // TAREA: Tiempo de expiración claro (1 hora)
        const token = jwt.sign(
          { id: usuario.id, rol: usuario.rol },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        // Guardar en memoria con caducidad de 1 hora
        activeSessions.set(usuario.id, {
          token: token,
          expiresAt: Date.now() + 3600000 // 1 hora en ms
        });

        // Configurar Cookie Segura (Max-Age=3600 es 1 hora)
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Set-Cookie": `revida_token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`,
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

  // ENDPOINT: CERRAR SESIÓN
  if (method === "POST" && url === "/api/logout") {
    const cookies = parseCookies(req);
    const token = cookies.revida_token;

    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        activeSessions.delete(decoded.id); // Eliminamos la sesión del servidor
      } catch (error) {
        // Ignorar si expiró o es inválido
      }
    }

    // Matamos la cookie en el navegador
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Set-Cookie": `revida_token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`,
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": "true"
    });
    
    res.end(JSON.stringify({ success: true, message: "Sesión cerrada correctamente" }));
    return;
  }

  // ENDPOINT: VALIDAR SESIÓN (Para la sincronización de pestañas en el Frontend)
  if (method === "GET" && url === "/api/validate-session") {
    const cookies = parseCookies(req);
    const token = cookies.revida_token;

    if (!token) {
      return sendJson(res, 401, { success: false, message: "No hay sesión activa" });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const sessionActiva = activeSessions.get(decoded.id);

      // Si no existe o no coincide con la guardada (invalidada)
      if (!sessionActiva || sessionActiva.token !== token) {
        return sendJson(res, 401, { success: false, message: "Sesión invalidada" });
      }

      // Si ya expiró el tiempo
      if (sessionActiva.expiresAt < Date.now()) {
        activeSessions.delete(decoded.id);
        return sendJson(res, 401, { success: false, message: "Sesión expirada" });
      }

      return sendJson(res, 200, { success: true, user: decoded });
    } catch (error) {
      return sendJson(res, 401, { success: false, message: "Token inválido" });
    }
  }

  return sendJson(res, 404, { success: false, message: "La ruta no existe" });
});

// Para evitar errores en las pruebas, solo encendemos el servidor si NO estamos testeando
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`Servidor REVIDA corriendo en http://localhost:${PORT}`);
  });
}

// Exportamos para que Supertest lo pueda usar sin problemas
export default server;