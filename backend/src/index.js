import http from "http";

const server = http.createServer((req, res) => {
  res.end("Revida backend running");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
