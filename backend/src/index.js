import http from "http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "revida_super_secreto"; // En producción esto iría en un archivo .env
const PORT = 3001;

// Encriptamos la contraseña "123456" para todos, simulando que así se guardó en la BD
const hashTemporal = bcrypt.hashSync("123456", 10);

let usuarios = [
  { id: 1, nombre: "Alan", email: "admin@revida.com", password: hashTemporal, rol: "Administrador" },
  { id: 2, nombre: "Miguel", email: "org@revida.com", password: hashTemporal, rol: "Organizacion" },
  { id: 3, nombre: "Fatima", email: "donador@revida.com", password: hashTemporal, rol: "Donador" }
];

// Helper para responder en JSON con CORS (Permite que el Frontend se conecte)
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data));
}

// Función para simular lentitud en la red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Manejo de CORS (Obligatorio para navegadores modernos)
  if (method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  // Ruta principal
  if (method === "GET" && url === "/") {
    return sendJson(res, 200, { message: "Revida Backend Activo" });
  }

  // Ruta para simular el ERROR 500
  if (method === "GET" && url === "/error-test") {
    await delay(200);
    return sendJson(res, 500, { success: false, message: "Error interno del servidor" });
  }

  // Ruta GET: Obtener usuarios
  if (method === "GET" && url === "/api/usuarios") {
    await delay(200); 
    return sendJson(res, 200, { success: true, data: usuarios });
  }

  // Ruta GET: Obtener un solo usuario
  if (method === "GET" && url.startsWith("/api/usuarios/")) {
    const id = parseInt(url.split("/")[3]);
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
      return sendJson(res, 404, { success: false, message: `El usuario no existe` });
    }
    return sendJson(res, 200, { success: true, data: usuario });
  }

  // Ruta POST: Crear usuario
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

  
  //NUEVA RUTA: Endpoint de Login Seguro con JWT y bcrypt
  if (method === "POST" && url === "/api/login") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { email, password } = JSON.parse(body);

        // Buscar al usuario por correo
        const usuario = usuarios.find(u => u.email === email);
        if (!usuario) {
          return sendJson(res, 401, { success: false, message: "Correo o contraseña incorrectos" });
        }

        // Comparar la contraseña enviada con la encriptada
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
          return sendJson(res, 401, { success: false, message: "Correo o contraseña incorrectos" });
        }

        // Generar el Token JWT con el Rol del usuario
        const token = jwt.sign(
          { id: usuario.id, rol: usuario.rol },
          SECRET_KEY,
          { expiresIn: "2h" }
        );

        // Enviar respuesta con Cookie HttpOnly
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict`,
          "Access-Control-Allow-Origin": "*",
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

  // Ruta no encontrada
  return sendJson(res, 404, { success: false, message: `La ruta solicitada (${url}) no existe` });
});

server.listen(PORT, () => {
  console.log(`Servidor REVIDA corriendo en http://localhost:${PORT}`);
});