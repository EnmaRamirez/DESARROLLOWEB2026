# 📝 Tarea: CRUD REST API de Alumnos con Express + Sitio Web

**Curso:** Desarrollo Web — Sesión 7 (API CRUD con Express)
**Universidad:** Mariano Gálvez de Guatemala
**Docente:** Ing. Marco Tulio Valdez
**Duración:** 3–4 días · 30–45 min/día

## 🎯 Objetivo

Construir una **API REST** con **Express** para gestionar **alumnos** (nombre, apellido, email, edad), y un **sitio web** servido como archivos estáticos por el mismo Express que opera el CRUD usando **Fetch**, **CSS** y **`<dialog>`**. Todas las operaciones de escritura pasan por un **middleware de autenticación falsa** que valida el header `x-api-key`. El **frontend también tiene pruebas** (con `jsdom` y `fetch` mockeado) que verifican la tabla, los `<dialog>` y las llamadas `POST`/`PUT`/`DELETE`.

## 📋 Lo que debes entregar

| Componente | Estado inicial | Qué debes hacer |
|------------|----------------|-----------------|
| `src/repositorio.js` | Clase con **TODOs** | Implementar `listar`, `obtener`, `crear`, `actualizar`, `eliminar` |
| `src/app.js` | Servidor con **TODOs** | Implementar los middlewares y las 5 rutas |
| `src/index.js` | Completo | Solo léelo y entiéndelo |
| `public/index.html` | Esqueleto | Completar el sitio (ids, eventos, contenido de la tabla) |
| `public/styles.css` | Plantilla básica | Mejorar el diseño |
| `public/app.js` | Funciones con **TODOs** | Implementar el cliente Fetch + dialogs |
| `tests/repositorio.test.js` | **Listo** | Son tu guía: pruébalos con `pnpm test` |
| `tests/api.test.js` | **Listo** | Son tu guía: definen el contrato de la API |
| `tests/frontend.test.js` | **Listo** | Pruebas del **sitio** con `jsdom` + `fetch` mockeado (tabla, dialogs, POST/PUT/DELETE) |

> ⚠️ **No cambies los tests ni los nombres/firmas exportados.** Tu implementación debe hacerlos pasar.

## 🔐 Autenticación falsa (middleware)

Las rutas de escritura (`POST`, `PUT`, `DELETE`) exigen el header:

```
x-api-key: umg-2026
```

El valor se lee de `process.env.API_KEY` (ver `config.env`). Si falta o es incorrecto → **401**.

## 🛣️ Endpoints

| Método | Ruta | Auth | Respuesta |
|--------|------|------|-----------|
| `GET` | `/alumnos` | No | `200` lista de alumnos |
| `GET` | `/alumnos/:id` | No | `200` alumno · `404` si no existe |
| `POST` | `/alumnos` | Sí | `201` alumno creado · `400` datos inválidos · `401` sin clave |
| `PUT` | `/alumnos/:id` | Sí | `200` actualizado · `404` si no existe |
| `DELETE` | `/alumnos/:id` | Sí | `204` eliminado · `404` si no existe |

**Alumno:**
```json
{ "id": "a-1", "nombre": "Ana", "apellido": "López", "email": "ana.lopez@umg.edu.gt", "edad": 20 }
```

Validaciones: `nombre`, `apellido` y `email` obligatorios (email debe contener `@`); `edad` opcional pero numérica `>= 0`.

## 🗓️ Plan de 4 días

| Día | Actividad | Commit sugerido |
|-----|-----------|-----------------|
| 1 | Leer el proyecto, instalar dependencias y correr `pnpm test` (aún fallan) | `chore: setup and review express project` |
| 2 | Implementar `src/repositorio.js` hasta pasar `tests/repositorio.test.js` | `feat: implement in-memory alumnos repository` |
| 3 | Implementar middlewares y rutas en `src/app.js` hasta pasar `tests/api.test.js` | `feat: add auth middleware and crud routes` |
| 4 | Construir el sitio (`public/`) con Fetch + dialogs y pulir CSS | `feat: build static crud site with fetch and dialogs` |

## 🚀 Cómo empezar

```bash
cd Sesion-07-Express-CRUD-Alumnos

pnpm install          # instala express + jsdom (dev)
pnpm test             # verás los tests fallar (es lo esperado)
pnpm run dev          # levanta el servidor en http://localhost:3000
```

Abre `http://localhost:3000/` para el sitio y `http://localhost:3000/alumnos` para la API.

## ✅ Cómo se califica

| Criterio | Peso |
|----------|------|
| **`pnpm test` pasa 100%** (unitarios + integración + frontend) | 70% |
| **Conventional Commits** (mínimo 4, uno por día) | 20% |
| **Calidad de código** (nombres claros, sin `var`, sin `any` innecesario, comentarios útiles) | 10% |

**Reglas de commits (siguen vigentes):** `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:` — en minúscula, en imperativo y un commit por avance real. No se acepta un solo commit gigante.

**Los tests cubren las 3 capas:**
- **Repositorio** (unitario): `listar`, `obtener`, `crear`, `actualizar`, `eliminar`
- **API** (integración): estáticos, auth `x-api-key`, CRUD, validaciones y 404/204
- **Frontend** (jsdom + fetch mockeado): render de la tabla, apertura de `<dialog>`s y llamadas `POST`/`PUT`/`DELETE`

## 🆘 Tips

1. **Repositorio:** `listar()` debe devolver una copia (`[...this.alumnos]`); `crear()` genera el id (`a-${this.siguienteId++}`) sin mutar el objeto recibido.
2. **Auth:** `const clave = req.get('x-api-key'); if (clave !== (process.env.API_KEY ?? 'umg-2026')) return res.status(401)...`
3. **Express 4:** los middlewares se pasan como argumentos: `app.post('/alumnos', autenticacionFalsa, validarAlumno, handler)`.
4. **Fetch en el sitio:** para POST/PUT usa `cabeceras()` (ya incluye `x-api-key`); para DELETE usa `cabeceras(false)`.
5. **Dialogs:** abre con `dialogoForm.showModal()` y cierra con `dialogoForm.close()`. En el submit usa `event.preventDefault()` para no cerrar el dialog antes de guardar.
6. **Recarga la tabla** con `cargarAlumnos()` después de cada operación para reflejar la verdad de la API.
7. **Frontend:** usa los ids del esqueleto (`#btnNuevo`, `#formAlumno`, `#dialogoForm`, `#dialogoEliminar`, `#btnConfirmarEliminar`, `#mensaje`). Las pruebas de frontend cargan tu HTML y tu JS en `jsdom` con un `fetch` simulado, así que el sitio debe funcionar con `fetch` real igual que con el mock.
