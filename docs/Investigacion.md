# Proyecto: REVIDA  
## Aplicación Web de Donaciones Comunitarias

---

## Bloque 1 — Fundamentos del proyecto

### Diferencia entre Página web y Aplicación web (Eduardo Lezama Zarate QA)

#### Página web
Una página web es un recurso en internet cuyo objetivo principal es mostrar información a los visitantes. Normalmente, su contenido es estático o cambia poco a lo largo del tiempo. Las páginas web no requieren que los usuarios ingresen datos o interactúen de forma compleja; su propósito principal es informar.

Ejemplo: una página institucional con información de contacto, historia o servicios.

#### Aplicación web
Una aplicación web es un sistema que corre en un navegador y permite al usuario interactuar con la información y el sistema mismo. Aquí los usuarios no solo ven contenido, sino que pueden enviar datos, recibir respuestas dinámicas y realizar acciones como registrarse, iniciar sesión, subir información o modificar datos existentes.

Las aplicaciones web normalmente trabajan con bases de datos, autenticación y lógica de negocio.

#### Principales diferencias

| Característica | Página web | Aplicación web |
|----------------|------------|----------------|
| Interactividad | Baja | Alta |
| Personalización | No | Sí |
| Persistencia de datos | No o limitada | Sí |
| Ejecución de acciones del usuario | No | Sí |
| Ejemplos | Sitios informativos | Redes sociales, sistemas de gestión |

---

### Ejemplos reales de aplicaciones web profesionales

1. **Google Drive**  
Permite a los usuarios almacenar, crear y compartir documentos en la nube. Es dinámica, responde a acciones del usuario y guarda información personalizada.

2. **Instagram (versión web)**  
Más allá de mostrar contenido, permite subir fotos, interactuar con publicaciones de otros usuarios y gestionar la cuenta.

3. **Amazon**  
Los usuarios pueden buscar productos, agregarlos al carrito, pagar y recibir recomendaciones personalizadas. Su backend coordina inventarios, usuarios y pagos.

Estos ejemplos muestran que las aplicaciones web están diseñadas para resolver tareas complejas, adaptarse a los usuarios y manejar datos dinámicos.

---

### Qué tipo de problemas se resuelven con software (Fatima Avelino Celis TL)

El software está diseñado para solucionar problemas que serían difíciles, lentos o costosos de atender manualmente. Algunos ejemplos son:

- Automatización de tareas repetitivas (cálculos, correos, reportes).
- Organización de grandes cantidades de datos (inventarios, historiales).
- Comunicación remota eficiente (videollamadas, chats).
- Acceso y gestión de servicios a distancia (banca, compras).
- Conexión de personas con necesidades comunitarias, como en **REVIDA**.

En resumen, el software permite resolver problemas sociales, organizativos y operativos de forma rápida, confiable y escalable.

---

### Arquitectura general de aplicaciones web

Una aplicación web se organiza en varias capas que garantizan funcionalidad, escalabilidad y mantenibilidad.

#### a) Frontend
Es la parte que interactúa directamente con el usuario desde el navegador.

**Responsabilidades:**
- Mostrar interfaces
- Validar entradas del usuario
- Navegación y flujos
- Accesibilidad

**Tecnologías:** React, Angular, Vue.

#### b) Backend
Es el componente que se ejecuta en el servidor y contiene la lógica de negocio.

**Responsabilidades:**
- Gestión de usuarios
- Lógica de donaciones
- APIs
- Autenticación

**Tecnologías:** Node.js, Django, Laravel.

#### c) Infraestructura / Entornos
Incluye los servicios que soportan la aplicación.

- Producción
- Staging
- Desarrollo
- Base de datos (MongoDB, PostgreSQL)
- Contenedores (Docker)
- CI/CD (automatización)

Esto permite que la aplicación sea estable, segura y escalable.

---

### Análisis de 2 plataformas reales similares a la idea del equipo (Jose Alberto Herrera Flores FE)

#### Plataforma 1: Freecycle

**Descripción:**  
Red global que permite donar y recibir objetos usados gratuitamente dentro de comunidades locales.

**Problema que resuelve:**  
Reduce desperdicio y fomenta la reutilización.

**Características:**
- Publicación de objetos
- Solicitud de artículos
- Comunicación entre usuarios

**Relación con REVIDA:**  
Ambas permiten publicar objetos y conectar donantes con receptores, con un enfoque comunitario.

---

#### Plataforma 2: GoFundMe

**Descripción:**  
Plataforma para recaudar donaciones económicas para causas personales o sociales.

**Problema que resuelve:**  
Facilita la recaudación segura de fondos.

**Características:**
- Creación de campañas
- Donaciones monetarias
- Seguimiento de aportaciones

**Relación con REVIDA:**  
Ambas se basan en apoyo comunitario, registro de usuarios e interacción constante.

---

## Bloque 2 — Arquitectura de información y accesibilidad

### Arquitectura de información
Es la organización lógica del contenido y funciones para que el usuario encuentre fácilmente lo que necesita.

En REVIDA se estructura en:
- Inicio / Panel
- Donar objeto
- Explorar donaciones
- Mis donaciones
- Perfil

---

### Jerarquías de contenido (Jose Miguel Jimenez Enriquez BE)
Define la importancia visual de los elementos.

Ejemplo en REVIDA:
- Listado de objetos con mayor peso visual
- Botones principales más destacados
- Textos secundarios menos visibles

---

### Patrones de navegación web
Uso de estructuras conocidas para facilitar la navegación.

En REVIDA:
- Menú principal
- Rutas claras
- Botones de acción visibles

---

### Orden de tabulación
Define el recorrido lógico al usar la tecla **Tab**.

En REVIDA:
- Flujo natural entre campos
- Sin saltos confusos

---

### Navegación por teclado (Alan Baltazar Figueroa DO)
Permite usar la aplicación solo con teclado (Tab, Enter, flechas).

REVIDA está pensada para que todas sus funciones sean accesibles sin mouse.

---

### Accesibilidad sin mouse
Garantiza el uso para personas con limitaciones motrices o visuales.

Incluye:
- Labels claros
- HTML semántico
- Buen contraste
- Compatibilidad con lectores de pantalla

---

## Conclusión general
REVIDA no solo requiere funcionalidad técnica, sino una correcta organización de la información y un enfoque fuerte en accesibilidad. Comprender la diferencia entre página web y aplicación web, analizar plataformas similares y aplicar buenas prácticas de arquitectura y accesibilidad garantiza una aplicación usable, profesional e inclusiva.
