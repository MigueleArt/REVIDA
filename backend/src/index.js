import http from "http";

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  // Ruta principal
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      success: true,
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
      success: true,
      data: usuarios
    }));
  }

  // Ruta no encontrada
  res.writeHead(404);
  return res.end(JSON.stringify({
    success: false,
    message: "Ruta no encontrada"
  }));
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});