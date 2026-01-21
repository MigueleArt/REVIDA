[![CI Backend](https://github.com/MigueleArt/REVIDA/actions/workflows/ci.yml/badge.svg)](https://github.com/MigueleArt/REVIDA/actions/workflows/ci.yml)
# Desarrollo Web Profesional – Equipo 2

Repositorio del proyecto **REVIDA** para la materia **Desarrollo Web Profesional**. El backend ya corre y expone una respuesta mínima; el frontend tiene Dockerfile y package.json, pero aún no está construida la app (el script de build es provisional).

## Estructura del repositorio

```
.
├─ backend/
│  ├─ Dockerfile
│  ├─ package.json
│  └─ src/
│     ├─ index.js        # servidor HTTP en :3000 (GET / → "Revida backend running")
│     ├─ config/         # placeholder
│     ├─ controllers/    # placeholder
│     ├─ models/         # placeholder
│     └─ routes/         # placeholder
├─ frontend/
│  ├─ Dockerfile         # ejecuta npm run build (placeholder)
│  ├─ package.json       # scripts: build/test (placeholders)
│  └─ src/               # estructura Next.js (App Router)
├─ docs/                 # PDFs y documentos del curso/proyecto
└─ docker-compose.yml    # servicios backend y frontend
```

## Tecnologías principales
- Next.js (App Router)
- TypeScript
- MongoDB
- Node.js
- Docker

## Requisitos
- Node.js 18+ y npm (para correr backend local)
- Docker + docker compose (para levantar contenedores)

## Backend
- Levantar en local:
  ```bash
  cd backend
  npm install
  npm start
  ```
  Visita `http://localhost:3000` → responde `Revida backend running`.

- Con Docker (solo backend):
  ```bash
  docker compose up --build backend
  ```
  Se expone en host `3004` (contenedor `3000`).

## Frontend (estado actual)
- Hay `Dockerfile` y `package.json`, pero el script `npm run build` es provisional y no genera el sitio (solo imprime un mensaje y sale con 0).
- Cuando se añada el código real de Next.js y sus dependencias, se podrá extender este README con variables de entorno (`NEXT_PUBLIC_API_URL`, etc.) y scripts (`dev`, `build`, `start`, `lint`).

## Docker Compose
- Levantar ambos servicios (backend listo, frontend build placeholder):
  ```bash
  docker compose up --build
  ```
- Puertos:
  - Backend: host `3004` → contenedor `3000`
  - Frontend: sin puerto expuesto todavía (al no haber app servida)

## Documentación
- Ver `docs/` para PDFs, reportes y entregables del curso.

## Equipo
- Tech Lead: Fátima Avelino Celis
- Frontend: José Alberto Herrera Flores
- Backend: José Miguel Jiménez Enríquez
- QA / Testing: Eduardo Lezama Zarate
- DevOps / CI-CD: Alan Baltazar Figueroa

## CI
- GitHub Actions para backend (badge en la cabecera).
