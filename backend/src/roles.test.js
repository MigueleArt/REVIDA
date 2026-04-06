import request from "supertest";
import server from "./index.js"; 
import { activeSessions } from "./index.js";

describe("Entregable BE: Evidencia de Bloqueos de Seguridad por Rol", () => {
  
  afterEach(() => {
    activeSessions.clear(); 
  });

  it("EVIDENCIA 1 (401): Bloquea el acceso al endpoint de usuarios si no hay token (Middleware Autenticación)", async () => {
    const response = await request(server).get("/api/usuarios");
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Acceso denegado. Se requiere iniciar sesión.");
  });

  it("EVIDENCIA 2 (403): Bloquea el acceso a un 'Donador' al intentar ver todos los usuarios (Middleware Autorización)", async () => {
    // 1. Iniciamos sesión con una cuenta de rol bajo (Donador)
    const loginRes = await request(server)
      .post("/api/login")
      .send({ email: "donador@revida.com", password: "123456" });
    
    // 2. Intentamos entrar al endpoint crítico protegido para Admins
    const response = await request(server)
      .get("/api/usuarios")
      .set("Cookie", loginRes.headers["set-cookie"]);

    // 3. Verificamos que sea rechazado con 403 Forbidden
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Acceso denegado. No tienes permisos para esta acción.");
  });

  it("EVIDENCIA 3 (200): Permite el acceso correctamente si el rol es 'Administrador'", async () => {
    // 1. Iniciamos sesión como Administrador
    const loginRes = await request(server)
      .post("/api/login")
      .send({ email: "admin@revida.com", password: "123456" });
    
    // 2. Intentamos entrar al endpoint crítico
    const response = await request(server)
      .get("/api/usuarios")
      .set("Cookie", loginRes.headers["set-cookie"]);

    // 3. Verificamos que tenga acceso exitoso
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});