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