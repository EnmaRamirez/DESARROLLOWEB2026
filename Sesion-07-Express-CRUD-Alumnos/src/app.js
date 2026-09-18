/**
 * app.js — Servidor Express (API REST + sitio estático)
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * TODO: implementa los middlewares y las rutas marcadas.
 * Los tests de `tests/api.test.js` describen exactamente el contrato
 * que debe cumplir cada endpoint (son tu guía).
 */

import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// __dirname en ES Modules
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// ============================================================
// MIDDLEWARES
// ============================================================

/**
 * "Autenticación falsa": exige el header `x-api-key`.
 *
 * TODO:
 *   - Lee el header con req.get('x-api-key')
 *   - Compáralo con process.env.API_KEY (si no está definida usa 'umg-2026')
 *   - Si no coincide → res.status(401).json({ error: 'No autorizado' })
 *   - Si coincide    → next()
 *
 * @type {import('express').RequestHandler}
 */
export function autenticacionFalsa(req, res, next) {
    next(); // ← TODO: reemplazar por la validación del header
}

/**
 * Validación básica del cuerpo de un alumno.
 *
 * TODO: valida que
 *   - `nombre`, `apellido` y `email` sean strings no vacíos (trim)
 *   - `email` contenga '@'
 *   - `edad`, si viene, sea un número mayor o igual a 0
 *   Si algo falla responde 400 con { error: '<mensaje>' }.
 *   Si todo está bien, llama a next().
 *
 * @type {import('express').RequestHandler}
 */
export function validarAlumno(req, res, next) {
    next(); // ← TODO: reemplazar por las validaciones
}

// ============================================================
// APP
// ============================================================

/**
 * Crea la app de Express con sus rutas.
 * Recibe el repositorio por parámetro (inyección de dependencias).
 *
 * @param {import('./repositorio.js').RepositorioAlumnos} repositorio
 * @returns {import('express').Express}
 */
export function crearApp(repositorio) {
    const app = express();

    // Middlewares base
    app.use(express.json());

    // Sitio web estático (public/index.html, styles.css, app.js)
    app.use(express.static(join(__dirname, '..', 'public')));

    // TODO: GET /alumnos → lista todos                    → 200 [ ...alumnos ]
    app.get('/alumnos', (req, res) => {
        res.status(501).json({ error: 'TODO: GET /alumnos' });
    });

    // TODO: GET /alumnos/:id → uno o 404
    app.get('/alumnos/:id', (req, res) => {
        res.status(501).json({ error: 'TODO: GET /alumnos/:id' });
    });

    // TODO: POST /alumnos → crear (requiere autenticacionFalsa + validarAlumno) → 201
    app.post('/alumnos', (req, res) => {
        res.status(501).json({ error: 'TODO: POST /alumnos' });
    });

    // TODO: PUT /alumnos/:id → actualizar (auth + validarAlumno) → 200 o 404
    app.put('/alumnos/:id', (req, res) => {
        res.status(501).json({ error: 'TODO: PUT /alumnos/:id' });
    });

    // TODO: DELETE /alumnos/:id → eliminar (auth) → 204 o 404
    app.delete('/alumnos/:id', (req, res) => {
        res.status(501).json({ error: 'TODO: DELETE /alumnos/:id' });
    });

    return app;
}
