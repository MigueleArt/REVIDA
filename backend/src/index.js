import http from "http";

const PORT = 3000;

let usuarios = [
  { id: 1, nombre: "Alan" },
  { id: 2, nombre: "Miguel" },
  { id: 3, nombre: "Fatima" }
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

// Función para simular lentitud en la red (Para que QA pruebe los Loaders)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // 1. Manejo de CORS (Obligatorio para navegadores modernos)
  if (method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  // 2. Ruta principal (Para comprobar que el servidor vive)
  if (method === "GET" && url === "/") {
    return sendJson(res, 200, { message: "Revida Backend Activo" });
  }

  // 3. Ruta para simular el ERROR 500 (Para pruebas de QA)
  if (method === "GET" && url === "/error-test") {
    await delay(500); // Simulamos que tarda un poco antes de fallar
    return sendJson(res, 500, {
      success: false,
      error: 500,
      message: "Error interno del servidor",
      details: "Fallo de conexión simulado para pruebas de QA"
    });
  }

  // 4. Ruta GET: Obtener usuarios (Funcionalidad real)
  if (method === "GET" && url === "/api/usuarios") {
    await delay(1500); // Retardo de 1.5 segundos para ver los estados de carga
    return sendJson(res, 200, {
      success: true,
      data: usuarios
    });
  }

  // 5. Ruta GET: Obtener un solo usuario (Manejo de Error 404 específico)
  if (method === "GET" && url.startsWith("/api/usuarios/")) {
    const id = parseInt(url.split("/")[3]);
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
      return sendJson(res, 404, {
        success: false,
        error: 404,
        message: `El usuario con ID ${id} no existe en la base de datos`
      });
    }

    return sendJson(res, 200, { success: true, data: usuario });
  }

  // 6. Ruta POST: Crear usuario (Manejo de Error 400)
  if (method === "POST" && url === "/api/usuarios") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        if (!data.nombre) {
          return sendJson(res, 400, {
            success: false,
            error: 400,
            message: "El campo 'nombre' es obligatorio para registrar un usuario"
          });
        }

        const nuevoUsuario = { id: usuarios.length + 1, nombre: data.nombre };
        usuarios.push(nuevoUsuario);
        return sendJson(res, 201, { success: true, data: nuevoUsuario });

      } catch (err) {
        return sendJson(res, 400, {
          success: false,
          error: 400,
          message: "El formato JSON enviado es inválido"
        });
      }
    });
    return;
  }

  // 7. Ruta no encontrada (Cualquier URL inventada cae aquí)
  return sendJson(res, 404, {
    success: false,
    error: 404,
    message: `La ruta solicitada (${url}) no existe en el sistema REVIDA`
  });
});

server.listen(PORT, () => {
  console.log(`Servidor REVIDA corriendo en http://localhost:${PORT}`);
});