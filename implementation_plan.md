# Login Accesible y Manejo de Sesión por Rol

Implementar tres entregables del Frontend: login funcional por teclado con HTML semántico, validaciones accesibles con ARIA, y ruteo protegido según el rol del usuario.

## User Review Required

> [!IMPORTANT]
> El backend actualmente **no tiene endpoint de login** (las carpetas `routes/` y `controllers/` solo tienen [.gitkeep](file:///c:/Users/jmigu/Documents/UTT/8VO%20CUATRI/DesarrolloWebProfesional/REVIDA/backend/src/routes/.gitkeep)). La función `loginUsuario()` que se agregará a [api.js](file:///c:/Users/jmigu/Documents/UTT/8VO%20CUATRI/DesarrolloWebProfesional/REVIDA/frontend/src/services/api.js) apuntará a `POST /api/auth/login`, pero mientras no exista el endpoint real, el login **simulará** la respuesta con datos mock para poder probar todo el flujo del lado cliente. Cuando el backend implemente el endpoint, solo habrá que eliminar el mock.

> [!IMPORTANT]
> **Roles definidos**: Se usarán los roles `admin` y `donador`. El admin ve todas las rutas (usuarios, donaciones, publicar). El donador solo ve sus donativos y mensajes. ¿Estás de acuerdo con esta estructura de roles?

---

## Proposed Changes

### Entregable 1 & 2 — Login semántico + Validaciones ARIA

#### [MODIFY] [page.jsx](file:///c:/Users/jmigu/Documents/UTT/8VO%20CUATRI/DesarrolloWebProfesional/REVIDA/frontend/src/app/auth/login/page.jsx)

- Agregar `id` + `htmlFor` en cada `<label>` → `<input>` para vincularlos correctamente
- Agregar `autoComplete="email"` y `autoComplete="current-password"` para asistentes de teclado
- Agregar `required` a ambos inputs
- Agregar `aria-invalid={true/false}` dinámico cuando hay error en un campo
- Agregar `aria-describedby="login-error"` a los inputs para que los lectores de pantalla lean el error
- Cambiar el contenedor de error para usar `aria-live="assertive"` y un `id="login-error"`
- Mensaje de error genérico y seguro: `"Credenciales incorrectas. Verifique su correo y contraseña."` (sin revelar cuál campo falló)
- Conectar con `loginUsuario()` (reemplazando el `setTimeout` con credenciales hardcodeadas)
- Redirigir según rol: `admin` → `/dashboard/usuarios`, `donador` → `/dashboard/mis-donativos`

---

### Entregable 3 — Manejo de sesión por rol

#### [MODIFY] [api.js](file:///c:/Users/jmigu/Documents/UTT/8VO%20CUATRI/DesarrolloWebProfesional/REVIDA/frontend/src/services/api.js)

- Agregar función `loginUsuario(email, password)` con `POST /api/auth/login`
- Incluir mock temporal que simula respuesta `{ token, rol, nombre }` mientras el backend no esté listo
- Agregar funciones helper: `getToken()`, `getUsuarioSesion()`, `logout()`

#### [NEW] [useAuth.js](file:///c:/Users/jmigu/Documents/UTT/8VO%20CUATRI/DesarrolloWebProfesional/REVIDA/frontend/src/hooks/useAuth.js)

- Hook que lee `localStorage` y expone: `{ usuario, rol, token, isAuthenticated, logout }`
- Se usará en [Navbar](file:///c:/Users/jmigu/Documents/UTT/8VO%20CUATRI/DesarrolloWebProfesional/REVIDA/frontend/src/components/Navbar.jsx#7-128) y en `ProtectedRoute`

#### [NEW] [ProtectedRoute.jsx](file:///c:/Users/jmigu/Documents/UTT/8VO%20CUATRI/DesarrolloWebProfesional/REVIDA/frontend/src/components/ProtectedRoute.jsx)

- Componente wrapper que:
  - Si no hay sesión → redirige a `/auth/login`
  - Si tiene sesión pero el rol no coincide con los roles permitidos → redirige a su panel por defecto
  - Si el rol coincide → renderiza `children`

#### [MODIFY] [Navbar.jsx](file:///c:/Users/jmigu/Documents/UTT/8VO%20CUATRI/DesarrolloWebProfesional/REVIDA/frontend/src/components/Navbar.jsx)

- Usar `useAuth` para mostrar el nombre real del usuario en vez de "Usuario Demo"
- Al hacer clic en "Salir", limpiar `localStorage` y redirigir a `/auth/login`
- Filtrar enlaces de navegación según el rol (admin ve todo, donador ve solo lo permitido)

#### [NEW] [layout.jsx](file:///c:/Users/jmigu/Documents/UTT/8VO%20CUATRI/DesarrolloWebProfesional/REVIDA/frontend/src/app/dashboard/layout.jsx)

- Layout para la sección `/dashboard/*` que envuelve el contenido con `ProtectedRoute`
- Así todas las rutas bajo `/dashboard` están protegidas automáticamente

---

## Verification Plan

### Automated Tests
- `npm run build` — Verificar que el proyecto compila sin errores

### Manual Verification (Browser)
1. Abrir `http://localhost:3000/auth/login`
2. **Tab a través de los campos** — verificar que el foco pasa por: email → contraseña → mostrar/ocultar → botón
3. **Enter para enviar** — sin llenar campos, verificar que aparece error accesible
4. **Login como admin** — usar `admin@revida.com` / `admin123` → redirige a `/dashboard/usuarios`
5. **Login como donador** — usar `donador@revida.com` / `donador123` → redirige a `/dashboard/mis-donativos`
6. **Ruta protegida** — sin sesión, ir directo a `/dashboard/usuarios` → redirige a `/auth/login`
7. **Cerrar sesión** — clic en "Salir" → limpia sesión y redirige a `/auth/login`
