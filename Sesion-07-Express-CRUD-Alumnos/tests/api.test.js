/**
 * api.test.js — Pruebas de INTEGRACIÓN de la API REST + sitio estático
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * Levantan la app de Express en un puerto libre y consumen la API con fetch().
 * Describen el contrato exacto de cada endpoint (tus rutas deben cumplirlo).
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';
import { RepositorioAlumnos, datosSemilla } from '../src/repositorio.js';

let servidor;
let base;

const CLAVE = 'clave-test';

function levantar(app) {
    return new Promise((resolve) => {
        const s = app.listen(0, '127.0.0.1', () => resolve(s));
    });
}

beforeEach(async () => {
    process.env.API_KEY = CLAVE;
    const repo = new RepositorioAlumnos(datosSemilla);
    const app = crearApp(repo);
    servidor = await levantar(app);
    base = `http://127.0.0.1:${servidor.address().port}`;
});

afterEach(async () => {
    await new Promise((resolve) => servidor.close(resolve));
});

// ============================================================
// Sitio estático
// ============================================================
describe('Sitio estático (public/)', () => {
    it('GET / sirve el index.html', async () => {
        const res = await fetch(`${base}/`);
        assert.equal(res.status, 200);
        assert.match(res.headers.get('content-type') ?? '', /html/);
        const html = await res.text();
        assert.match(html, /<dialog/i, 'El sitio debe usar <dialog> para las operaciones');
    });

    it('GET /styles.css sirve la hoja de estilos', async () => {
        const res = await fetch(`${base}/styles.css`);
        assert.equal(res.status, 200);
        assert.match(res.headers.get('content-type') ?? '', /css/);
    });

    it('GET /app.js sirve el script del cliente', async () => {
        const res = await fetch(`${base}/app.js`);
        assert.equal(res.status, 200);
        assert.match(res.headers.get('content-type') ?? '', /javascript/);
    });
});

// ============================================================
// Autenticación falsa (header x-api-key)
// ============================================================
describe('Middleware de autenticación falsa', () => {
    const alumno = { nombre: 'Pedro', apellido: 'Ruiz', email: 'pedro@umg.edu.gt', edad: 19 };

    it('POST sin header x-api-key responde 401', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alumno),
        });
        assert.equal(res.status, 401);
    });

    it('POST con header incorrecto responde 401', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': 'clave-mala' },
            body: JSON.stringify(alumno),
        });
        assert.equal(res.status, 401);
    });

    it('DELETE sin header responde 401', async () => {
        const res = await fetch(`${base}/alumnos/a-1`, { method: 'DELETE' });
        assert.equal(res.status, 401);
    });
});

// ============================================================
// CRUD de alumnos
// ============================================================
describe('CRUD /alumnos', () => {
    const auth = { 'Content-Type': 'application/json', 'x-api-key': CLAVE };

    it('GET /alumnos devuelve la lista completa', async () => {
        const res = await fetch(`${base}/alumnos`);
        assert.equal(res.status, 200);
        const datos = await res.json();
        assert.ok(Array.isArray(datos));
        assert.equal(datos.length, datosSemilla.length);
    });

    it('GET /alumnos/:id devuelve un alumno', async () => {
        const res = await fetch(`${base}/alumnos/a-1`);
        assert.equal(res.status, 200);
        const alumno = await res.json();
        assert.equal(alumno.nombre, 'Ana');
    });

    it('GET /alumnos/:id inexistente responde 404', async () => {
        const res = await fetch(`${base}/alumnos/no-existe`);
        assert.equal(res.status, 404);
    });

    it('POST /alumnos crea un alumno (201)', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: auth,
            body: JSON.stringify({ nombre: 'Pedro', apellido: 'Ruiz', email: 'pedro@umg.edu.gt', edad: 19 }),
        });
        assert.equal(res.status, 201);

        const creado = await res.json();
        assert.equal(typeof creado.id, 'string');
        assert.equal(creado.nombre, 'Pedro');

        const lista = await (await fetch(`${base}/alumnos`)).json();
        assert.equal(lista.length, datosSemilla.length + 1);
    });

    it('POST /alumnos sin nombre responde 400', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: auth,
            body: JSON.stringify({ apellido: 'Ruiz', email: 'pedro@umg.edu.gt' }),
        });
        assert.equal(res.status, 400);
    });

    it('POST /alumnos con email inválido responde 400', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: auth,
            body: JSON.stringify({ nombre: 'Pedro', apellido: 'Ruiz', email: 'correo-invalido' }),
        });
        assert.equal(res.status, 400);
    });

    it('POST /alumnos con edad no numérica responde 400', async () => {
        const res = await fetch(`${base}/alumnos`, {
            method: 'POST',
            headers: auth,
            body: JSON.stringify({ nombre: 'Pedro', apellido: 'Ruiz', email: 'pedro@umg.edu.gt', edad: 'veinte' }),
        });
        assert.equal(res.status, 400);
    });

    it('PUT /alumnos/:id actualiza un alumno (200)', async () => {
        const res = await fetch(`${base}/alumnos/a-1`, {
            method: 'PUT',
            headers: auth,
            body: JSON.stringify({ nombre: 'Ana María', apellido: 'López', email: 'ana.lopez@umg.edu.gt', edad: 21 }),
        });
        assert.equal(res.status, 200);

        const actualizado = await res.json();
        assert.equal(actualizado.nombre, 'Ana María');
        assert.equal((await (await fetch(`${base}/alumnos/a-1`)).json()).nombre, 'Ana María');
    });

    it('PUT /alumnos/:id inexistente responde 404', async () => {
        const res = await fetch(`${base}/alumnos/no-existe`, {
            method: 'PUT',
            headers: auth,
            body: JSON.stringify({ nombre: 'X', apellido: 'Y', email: 'x@y.com', edad: 1 }),
        });
        assert.equal(res.status, 404);
    });

    it('DELETE /alumnos/:id elimina (204) y desaparece de la lista', async () => {
        const res = await fetch(`${base}/alumnos/a-2`, {
            method: 'DELETE',
            headers: { 'x-api-key': CLAVE },
        });
        assert.equal(res.status, 204);

        assert.equal((await fetch(`${base}/alumnos/a-2`)).status, 404);
        const lista = await (await fetch(`${base}/alumnos`)).json();
        assert.equal(lista.length, datosSemilla.length - 1);
    });

    it('DELETE /alumnos/:id inexistente responde 404', async () => {
        const res = await fetch(`${base}/alumnos/no-existe`, {
            method: 'DELETE',
            headers: { 'x-api-key': CLAVE },
        });
        assert.equal(res.status, 404);
    });
});
