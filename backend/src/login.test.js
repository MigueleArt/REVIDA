import request from "supertest";
// Importamos el servidor directamente
import server from "./index.js"; 
// Importamos el Map de sesiones para poder limpiarlo entre pruebas
import { activeSessions } from "./index.js";

describe("Pruebas de Seguridad: Endpoint de Login y Multisesiones", () => {
  
  // Limpiamos las sesiones después de cada prueba para que no interfieran
  afterEach(() => {
    activeSessions.clear();
  });

  it("1. Debe regresar 200 OK y el rol si las credenciales son correctas", async () => {
    const response = await request(server)
      .post("/api/login")
      .send({ email: "admin@revida.com", password: "123456" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.datos.rol).toBe("Administrador");
    
    // Verificamos la configuración correcta de la Cookie segura (1 hora)
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toMatch(/HttpOnly/);
    expect(response.headers["set-cookie"][0]).toMatch(/Max-Age=3600/);
  });

  it("2. Debe regresar 409 si el usuario ya tiene una sesión activa", async () => {
    // Primer login exitoso
    await request(server)
      .post("/api/login")
      .send({ email: "admin@revida.com", password: "123456" });

    // Segundo login desde otro dispositivo simulado
    const response2 = await request(server)
      .post("/api/login")
      .send({ email: "admin@revida.com", password: "123456" });

    // Verificamos que se bloquee el segundo intento
    expect(response2.status).toBe(409);
    expect(response2.body.message).toContain("sesión activa");
  });

  it("3. Debe regresar 401 Unauthorized si la contraseña es incorrecta", async () => {
    const response = await request(server)
      .post("/api/login")
      .send({ email: "admin@revida.com", password: "soy_un_hacker_123" });

    expect(response.status).toBe(401);
  });

  it("4. Debe regresar 401 Unauthorized si el correo no existe", async () => {
    const response = await request(server)
      .post("/api/login")
      .send({ email: "fantasma@revida.com", password: "123456" });

    expect(response.status).toBe(401);
  });

});