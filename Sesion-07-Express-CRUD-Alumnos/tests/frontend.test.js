/**
 * frontend.test.js — Pruebas del SITIO (frontend) con jsdom
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * Cargan tu `public/index.html`, ejecutan tu `public/app.js` en un DOM
 * simulado y reemplazan `fetch` por un mock. Verifican que el sitio:
 *   - Liste los alumnos al iniciar
 *   - Abra los <dialog> para crear/editar/eliminar
 *   - Haga POST / PUT / DELETE con el header x-api-key y el cuerpo correcto
 *
 * 📌 Usa los ids del esqueleto (#btnNuevo, #formAlumno, #dialogoForm,
 *    #dialogoEliminar, #btnConfirmarEliminar, #mensaje, etc.).
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const publicDir = join(root, 'public');

const ALUMNOS = [
    { id: 'a-1', nombre: 'Ana', apellido: 'López', email: 'ana.lopez@umg.edu.gt', edad: 20 },
    { id: 'a-2', nombre: 'Luis', apellido: 'Pérez', email: 'luis.perez@umg.edu.gt', edad: 22 },
];

/** Respuesta mínima compatible con la que consume app.js */
const respuesta = (body, { ok = true, status = 200 } = {}) => ({
    ok,
    status,
    json: async () => body,
});

let dom;
let llamadas;

/** Espera a que se resuelvan las promesas pendientes (fetch mockeado) */
const esperar = () => new Promise((r) => setTimeout(r, 0));

function buscarBoton(contenedor, texto) {
    return [...contenedor.querySelectorAll('button')]
        .find((b) => b.textContent.toLowerCase().includes(texto.toLowerCase()));
}

beforeEach(async () => {
    const html = await readFile(join(publicDir, 'index.html'), 'utf-8');
    dom = new JSDOM(html, { url: 'http://localhost:3000/' });

    // jsdom no implementa showModal/close de <dialog>: los simulamos
    const { HTMLDialogElement } = dom.window;
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
    HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };

    // Mock de fetch: registra cada llamada y responde según el método
    llamadas = [];
    dom.window.fetch = async (url, opciones = {}) => {
        llamadas.push({ url: String(url), opciones });
        const metodo = (opciones.method ?? 'GET').toUpperCase();
        if (metodo === 'GET') {
            const match = String(url).match(/\/alumnos\/([^/]+)$/);
            if (match) {
                const alumno = ALUMNOS.find((a) => a.id === match[1]);
                return alumno
                    ? respuesta(alumno)
                    : respuesta({ error: 'No encontrado' }, { ok: false, status: 404 });
            }
            return respuesta(ALUMNOS);
        }
        const datos = opciones.body ? JSON.parse(opciones.body) : {};
        if (metodo === 'POST') return respuesta({ id: 'a-9', ...datos }, { status: 201 });
        if (metodo === 'PUT') return respuesta({ id: 'a-1', ...datos });
        if (metodo === 'DELETE') return respuesta(null, { status: 204 });
        return respuesta({}, { ok: false, status: 400 });
    };

    // Exponer los globals que usa public/app.js
    global.window = dom.window;
    global.document = dom.window.document;
    global.fetch = dom.window.fetch;
    global.Event = dom.window.Event;

    // Ejecutar app.js (cache-busting para re-ejecutarlo en cada test)
    await import(`${join(publicDir, 'app.js')}?t=${Date.now()}-${Math.random()}`);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    await esperar();
});

describe('Frontend · carga inicial', () => {
    it('hace GET /alumnos al iniciar', () => {
        const peticion = llamadas.find((l) => l.url.includes('/alumnos'));
        assert.ok(peticion, 'No se llamó a fetch /alumnos');
    });

    it('pinta una fila por alumno con su nombre', () => {
        const filas = dom.window.document.querySelectorAll('#tablaAlumnos tbody tr');
        assert.equal(filas.length, ALUMNOS.length);
        const texto = dom.window.document.querySelector('#tablaAlumnos tbody').textContent;
        assert.match(texto, /Ana/);
        assert.match(texto, /Luis/);
    });

    it('cada fila ofrece acciones de editar y eliminar', () => {
        const fila = dom.window.document.querySelector('#tablaAlumnos tbody tr');
        assert.ok(buscarBoton(fila, 'editar'), 'Falta el botón Editar en la fila');
        assert.ok(buscarBoton(fila, 'eliminar'), 'Falta el botón Eliminar en la fila');
    });
});

describe('Frontend · crear', () => {
    it('el botón Nuevo abre el <dialog> del formulario', () => {
        dom.window.document.querySelector('#btnNuevo').click();
        assert.ok(
            dom.window.document.querySelector('#dialogoForm').hasAttribute('open'),
            'dialogoForm no se abrió',
        );
    });

    it('guardar hace POST /alumnos con x-api-key y el cuerpo del formulario', async () => {
        dom.window.document.querySelector('#btnNuevo').click();
        dom.window.document.querySelector('#nombre').value = 'Pedro';
        dom.window.document.querySelector('#apellido').value = 'Ruiz';
        dom.window.document.querySelector('#email').value = 'pedro@umg.edu.gt';
        dom.window.document.querySelector('#edad').value = '19';

        dom.window.document.querySelector('#formAlumno')
            .dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
        await esperar();

        const post = llamadas.find((l) => (l.opciones.method ?? '').toUpperCase() === 'POST');
        assert.ok(post, 'No se hizo POST al guardar');
        assert.match(post.url, /\/alumnos\/?$/);
        assert.ok(tieneClaveApi(post), 'El POST no envió el header x-api-key');

        const cuerpo = JSON.parse(post.opciones.body);
        assert.equal(cuerpo.nombre, 'Pedro');
        assert.equal(cuerpo.email, 'pedro@umg.edu.gt');
    });
});

describe('Frontend · editar', () => {
    it('abre el dialog precargado y guarda con PUT', async () => {
        const fila = dom.window.document.querySelector('#tablaAlumnos tbody tr');
        buscarBoton(fila, 'editar').click();
        await esperar();

        assert.ok(dom.window.document.querySelector('#dialogoForm').hasAttribute('open'));
        assert.equal(dom.window.document.querySelector('#nombre').value, 'Ana');

        dom.window.document.querySelector('#formAlumno')
            .dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
        await esperar();

        const put = llamadas.find((l) => (l.opciones.method ?? '').toUpperCase() === 'PUT');
        assert.ok(put, 'No se hizo PUT al editar');
        assert.match(put.url, /\/alumnos\/a-1$/);
        assert.ok(tieneClaveApi(put), 'El PUT no envió el header x-api-key');
    });
});

describe('Frontend · eliminar', () => {
    it('pide confirmación y hace DELETE con x-api-key', async () => {
        const fila = dom.window.document.querySelector('#tablaAlumnos tbody tr');
        buscarBoton(fila, 'eliminar').click();

        assert.ok(
            dom.window.document.querySelector('#dialogoEliminar').hasAttribute('open'),
            'No se abrió el dialog de confirmación',
        );

        dom.window.document.querySelector('#btnConfirmarEliminar').click();
        await esperar();

        const del = llamadas.find((l) => (l.opciones.method ?? '').toUpperCase() === 'DELETE');
        assert.ok(del, 'No se hizo DELETE');
        assert.match(del.url, /\/alumnos\/a-1$/);
        assert.ok(tieneClaveApi(del), 'El DELETE no envió el header x-api-key');
    });
});

describe('Frontend · errores', () => {
    it('muestra un mensaje si la operación falla', async () => {
        const falla = async () => respuesta({ error: 'No autorizado' }, { ok: false, status: 401 });
        global.fetch = falla;
        dom.window.fetch = falla;

        dom.window.document.querySelector('#btnNuevo').click();
        dom.window.document.querySelector('#nombre').value = 'X';
        dom.window.document.querySelector('#apellido').value = 'Y';
        dom.window.document.querySelector('#email').value = 'x@y.com';
        dom.window.document.querySelector('#formAlumno')
            .dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
        await esperar();

        const mensaje = dom.window.document.querySelector('#mensaje').textContent.trim();
        assert.ok(mensaje.length > 0, 'No se mostró ningún mensaje de error');
    });
});

/** Verifica que la petición incluya el header x-api-key (sin importar mayúsculas) */
function tieneClaveApi(llamada) {
    const headers = llamada.opciones.headers ?? {};
    return Object.keys(headers).some((k) => k.toLowerCase() === 'x-api-key');
}
