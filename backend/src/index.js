import http from "http";

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  // Ruta principal
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      status: "success",
      message: "Revida backend running"
    }));
  }

  // Endpoint ejemplo REST
  if (req.method === "GET" && req.url === "/api/usuarios") {
    const usuarios = [
      { id: 1, nombre: "Alan" },
      { id: 2, nombre: "Miguel" }
    ];

    res.writeHead(200);
    return res.end(JSON.stringify({
      status: "success",
      data: usuarios
    }));
  }

  // Simulación de error 500
  if (req.method === "GET" && req.url === "/error-test") {
    res.writeHead(500);
    return res.end(JSON.stringify({
      status: "error",
      error: 500,
      message: "Error interno en el servidor de REVIDA",
      details: "No se pudo conectar con la base de datos.",
      next_steps: "El equipo técnico ha sido notificado. Intenta más tarde."
    }));
  }

  // 404
  res.writeHead(404);
  return res.end(JSON.stringify({
    status: "error",
    error: 404,
    message: "La ruta solicitada no existe en el sistema REVIDA"
  }));
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});