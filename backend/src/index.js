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

export const activeSessions = new Map();
export const recoveryTokens = new Map();

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

function sendJson(res, statusCode, data, req) {
  const origin = req?.headers?.origin || "http://localhost:3000";
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true"
  });
  res.end(JSON.stringify(data));
}

function authenticateRequest(req, res) {
  const cookies = parseCookies(req);
  const token = cookies.revida_token;

  if (!token) {
    sendJson(res, 401, { success: false, message: "Acceso denegado. Se requiere iniciar sesión." }, req);
    return null;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const sessionActiva = activeSessions.get(decoded.id);

    if (!sessionActiva || sessionActiva.token !== token || sessionActiva.expiresAt < Date.now()) {
      sendJson(res, 401, { success: false, message: "Sesión inválida o expirada." }, req);
      return null;
    }
    
    return decoded; 
  } catch (error) {
    sendJson(res, 401, { success: false, message: "Token inválido." }, req);
    return null;
  }
}

function authorizeRole(user, allowedRoles, res, req) {
  if (!allowedRoles.includes(user.rol)) {
    sendJson(res, 403, { success: false, message: "Acceso denegado. No tienes permisos para esta acción." }, req);
    return false; 
  }
  return true;
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === "OPTIONS") return sendJson(res, 204, {}, req);
  if (method === "GET" && url === "/") return sendJson(res, 200, { message: "Revida Backend Activo" }, req);

  if (method === "GET" && url === "/api/usuarios") {
    const user = authenticateRequest(req, res);
    if (!user) return; 

    if (!authorizeRole(user, ["Administrador", "admin"], res, req)) return; 

    return sendJson(res, 200, { success: true, data: usuarios }, req);
  }

  if (method === "GET" && url.startsWith("/api/usuarios/")) {
    const user = authenticateRequest(req, res);
    if (!user) return;

    const idSolicitado = parseInt(url.split("/")[3]);

    if (!["Administrador", "admin"].includes(user.rol) && user.id !== idSolicitado) {
      return sendJson(res, 403, { success: false, message: "Acceso denegado. Solo puedes ver tu propio perfil." }, req);
    }

    const usuarioEncontrado = usuarios.find(u => u.id === idSolicitado);
    if (!usuarioEncontrado) return sendJson(res, 404, { success: false, message: "El usuario no existe" }, req);
    
    return sendJson(res, 200, { success: true, data: usuarioEncontrado }, req);
  }

  if (method === "POST" && url === "/api/usuarios") {
    const user = authenticateRequest(req, res);
    if (!user) return; 
    if (!authorizeRole(user, ["Administrador", "admin"], res, req)) return; 

    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const nuevoUsuario = { id: usuarios.length + 1, nombre: data.nombre, email: data.email, rol: data.rol };
        usuarios.push(nuevoUsuario);
        return sendJson(res, 201, { success: true, data: nuevoUsuario }, req);
      } catch (err) {
        return sendJson(res, 400, { success: false, message: "JSON inválido" }, req);
      }
    });
    return;
  }

  if (method === "POST" && url === "/api/login") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { email, password } = JSON.parse(body);
        const usuario = usuarios.find(u => u.email === email);
        
        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
          return sendJson(res, 401, { success: false, message: "Correo o contraseña incorrectos" }, req);
        }

        if (activeSessions.has(usuario.id)) {
          const sesionActual = activeSessions.get(usuario.id);
          if (sesionActual.expiresAt > Date.now()) {
            return sendJson(res, 409, { 
              success: false, 
              message: "Ya hay una sesión activa en otro dispositivo." 
            }, req);
          } else {
            activeSessions.delete(usuario.id);
          }
        }

        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, SECRET_KEY, { expiresIn: "1h" });
        activeSessions.set(usuario.id, { token: token, expiresAt: Date.now() + 3600000 });

        const origin = req?.headers?.origin || "http://localhost:3000";

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Set-Cookie": `revida_token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=None; Secure`,
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Credentials": "true"
        });
        
        res.end(JSON.stringify({ success: true, datos: { nombre: usuario.nombre, rol: usuario.rol } }));
      } catch (err) {
        return sendJson(res, 400, { success: false, message: "Error al procesar el login" }, req);
      }
    });
    return;
  }

  if (method === "POST" && url === "/api/recuperar-password") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { email } = JSON.parse(body);
        const usuario = usuarios.find(u => u.email === email);

        if (usuario) {
          const recoveryToken = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: "15m" });
          recoveryTokens.set(usuario.id, recoveryToken);
        }

        return sendJson(res, 200, { success: true, message: "Si el correo está registrado, recibirás instrucciones." }, req);
      } catch (err) {
        return sendJson(res, 400, { success: false, message: "Error al procesar la solicitud" }, req);
      }
    });
    return;
  }
  
  if (method === "POST" && url === "/api/logout") {
    const cookies = parseCookies(req);
    const token = cookies.revida_token;
    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        activeSessions.delete(decoded.id);
      } catch (error) {}
    }

    const origin = req?.headers?.origin || "http://localhost:3000";

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Set-Cookie": `revida_token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure`,
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true"
    });
    res.end(JSON.stringify({ success: true, message: "Sesión cerrada correctamente" }));
    return;
  }

  if (method === "GET" && url === "/api/validate-session") {
    const cookies = parseCookies(req);
    const token = cookies.revida_token;

    if (!token) {
      return sendJson(res, 401, { success: false, message: "No hay sesión activa" }, req);
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const sessionActiva = activeSessions.get(decoded.id);

      if (!sessionActiva || sessionActiva.token !== token) {
        return sendJson(res, 401, { success: false, message: "Sesión invalidada" }, req);
      }

      if (sessionActiva.expiresAt < Date.now()) {
        activeSessions.delete(decoded.id);
        return sendJson(res, 401, { success: false, message: "Sesión expirada" }, req);
      }

      return sendJson(res, 200, { success: true, user: decoded }, req);
    } catch (error) {
      return sendJson(res, 401, { success: false, message: "Token inválido" }, req);
    }
  }

  return sendJson(res, 404, { success: false, message: "La ruta no existe" }, req);
});

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => { console.log(`Servidor REVIDA corriendo en http://localhost:${PORT}`); });
}

export default server;

