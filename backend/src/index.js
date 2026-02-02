import http from "http";

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/") {
    res.writeHead(200);
    res.end(JSON.stringify({ 
        status: "success", 
        message: "Revida backend running" 
    }));
  } 

  else if (req.url === "/error-test") {
    res.writeHead(500);
    res.end(JSON.stringify({ 
      status: "error",
      error: 500, 
      message: "Error interno en el servidor de REVIDA",
      details: "No se pudo conectar con la base de datos.",
      next_steps: "El equipo técnico ha sido notificado. Por favor, intenta de nuevo más tarde."
    }));
  }
  // error 404
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ 
      error: 404, 
      message: "La ruta solicitada no existe en el sistema REVIDA",
      hint: "Verifica si escribiste bien la URL"
    }));
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});