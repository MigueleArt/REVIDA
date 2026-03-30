# Evidencia QA: Recuperación de Contraseña Segura
**Rol:** QA Tester

## 1. Investigación Técnica (Individual)
* **¿Qué es un token de recuperación?** Es una clave temporal, única y segura que el Backend genera para que el usuario pueda cambiar su contraseña sin saber la anterior.
* **¿Por qué deben expirar?** Para evitar que, si un hacker roba el enlace de recuperación días después, pueda usarlo. La ventana de tiempo debe ser corta (ej. 15 minutos).
* **¿Qué ataques existen?** - *Fuerza bruta:* Intentar adivinar el token probando miles de combinaciones.
  - *Enumeración de usuarios:* Meter correos al azar en el formulario para ver si el sistema dice "Este correo no existe" y así descubrir quién sí está registrado.
* **¿Cómo se hace accesible?** Usando etiquetas ARIA, permitiendo navegar todo el formulario solo con la tecla `Tab` del teclado y asegurando buen contraste de colores.

## 2. Casos de Prueba Diseñados
| Tipo | Caso a probar | Resultado esperado (Criterio de éxito) |
|---|---|---|
| **Token** | Usar token válido | Deja cambiar la contraseña y luego destruye el token. |
| **Token** | Usar token expirado/reutilizado | Muestra error y bloquea el cambio. |
| **Ataque** | Poner correo que NO existe | El mensaje debe decir "Si el correo existe, enviamos un enlace" (No debe revelar que el correo es falso). |
| **Ataque** | Fuerza bruta | Si le doy clic a enviar 20 veces, el servidor me bloquea (Rate limit). |
| **Accesibilidad**| Navegación por teclado | Puedo llegar al botón "Enviar" usando solo la tecla Tab, y se ve un recuadro que me indica dónde estoy. |