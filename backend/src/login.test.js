import request from "supertest";

// Apuntamos al servidor que tienes prendido en tu otra terminal
const API_URL = "http://localhost:3001";

describe("Pruebas de Seguridad: Endpoint de Login", () => {
  
  it("1. Debe regresar 200 OK y el rol si las credenciales son correctas", async () => {
    const response = await request(API_URL)
      .post("/api/login")
      .send({ email: "admin@revida.com", password: "123456" });

    // Verificamos que responda 200 OK
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Verificamos que nos devuelva el rol del usuario
    expect(response.body.datos.rol).toBe("Administrador");
    
    // Verificamos que envíe la Cookie HttpOnly con el Token
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toMatch(/HttpOnly/);
  });

  it("2. Debe regresar 401 Unauthorized si la contraseña es incorrecta", async () => {
    const response = await request(API_URL)
      .post("/api/login")
      .send({ email: "admin@revida.com", password: "soy_un_hacker_123" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Correo o contraseña incorrectos");
  });

  it("3. Debe regresar 401 Unauthorized si el correo no existe", async () => {
    const response = await request(API_URL)
      .post("/api/login")
      .send({ email: "fantasma@revida.com", password: "123456" });

    expect(response.status).toBe(401);
  });

});