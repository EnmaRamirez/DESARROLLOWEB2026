import { describe, it, before, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function readFile(relativePath) {
    const fullPath = resolve(root, relativePath);
    if (!existsSync(fullPath)) return null;
    return readFileSync(fullPath, 'utf-8');
}

// Carga dinámica de src/app.js como texto para inspección
// (los tests funcionales usan JSDOM + import dinámico)

describe('Estructura del proyecto', () => {
    it('index.html debe existir', () => {
        assert.ok(existsSync(resolve(root, 'index.html')), 'index.html no encontrado');
    });

    it('styles.css debe existir', () => {
        assert.ok(existsSync(resolve(root, 'styles.css')), 'styles.css no encontrado');
    });

    it('src/app.js debe existir', () => {
        assert.ok(existsSync(resolve(root, 'src/app.js')), 'src/app.js no encontrado');
    });

    it('index.html debe tener lang="es"', () => {
        const html = readFile('index.html');
        assert.ok(html, 'index.html no se pudo leer');
        assert.ok(
            /<html[^>]+lang=["']es["'][^>]*>/i.test(html),
            'El atributo lang="es" no está presente en <html>'
        );
    });

    it('index.html debe enlazar styles.css', () => {
        const html = readFile('index.html');
        assert.ok(html, 'index.html no se pudo leer');
        assert.ok(
            /<link[^>]+href=["']styles\.css["'][^>]*>/i.test(html),
            'No se encontró <link> hacia styles.css'
        );
    });

    it('index.html debe enlazar src/app.js como módulo', () => {
        const html = readFile('index.html');
        assert.ok(html, 'index.html no se pudo leer');
        assert.ok(
            /<script[^>]+src=["']src\/app\.js["'][^>]*>/i.test(html),
            'No se encontró <script src="src/app.js">'
        );
        assert.ok(
            /<script[^>]+type=["']module["'][^>]*>/i.test(html),
            'El <script> debería cargarse con type="module"'
        );
    });
});

describe('HTML semántico y accesible', () => {
    const html = readFile('index.html');

    it('Debe tener un <main>', () => {
        assert.ok(html, 'index.html no se pudo leer');
        assert.ok(/<main/.test(html), 'No se encontró <main>');
    });

    it('Debe tener un <form id="form-tarea">', () => {
        assert.ok(html, 'index.html no se pudo leer');
        assert.ok(
            /<form[^>]+id=["']form-tarea["']/i.test(html),
            'No se encontró <form id="form-tarea">'
        );
    });

    it('Debe tener un <input id="input-tarea">', () => {
        assert.ok(html, 'index.html no se pudo leer');
        assert.ok(
            /<input[^>]+id=["']input-tarea["']/i.test(html),
            'No se encontró <input id="input-tarea">'
        );
    });

    it('El input debe tener un <label> asociado', () => {
        assert.ok(html, 'index.html no se pudo leer');
        assert.ok(
            /<label[^>]+for=["']input-tarea["']/i.test(html),
            'Falta un <label for="input-tarea">'
        );
    });

    it('Debe tener un <ul id="lista-tareas">', () => {
        assert.ok(html, 'index.html no se pudo leer');
        assert.ok(
            /<ul[^>]+id=["']lista-tareas["']/i.test(html),
            'No se encontró <ul id="lista-tareas">'
        );
    });

    it('Debe tener al menos 3 botones de filtro con data-filtro', () => {
        assert.ok(html, 'index.html no se pudo leer');
        const matches = html.match(/<button[^>]+data-filtro=/gi);
        assert.ok(matches && matches.length >= 3,
            `Se esperaban al menos 3 botones con data-filtro, hay ${matches ? matches.length : 0}`);
    });
});

describe('Calidad de JavaScript', () => {
    const js = readFile('src/app.js');

    it('src/app.js no debe usar var (debe usar const o let)', () => {
        assert.ok(js, 'src/app.js no se pudo leer');
        // Buscar declaraciones de variable que NO sean comentarios
        const lineas = js.split('\n');
        for (const linea of lineas) {
            const limpia = linea.replace(/\/\/.*$/, '').trim();
            // Detectar "var " al inicio de sentencia (no como substring)
            assert.ok(
                !/^var\s+/.test(limpia) && !/\svar\s+[a-zA-Z_$]/.test(limpia),
                `Se encontró "var" en: ${linea}`
            );
        }
    });

    it('Debe exportar las funciones requeridas', () => {
        assert.ok(js, 'src/app.js no se pudo leer');
        const exportsRequeridos = [
            'agregarTarea',
            'eliminarTarea',
            'toggleTarea',
            'filtrarTareas',
            'guardar',
            'cargar',
        ];
        for (const fn of exportsRequeridos) {
            const patron = new RegExp(`export\\s+function\\s+${fn}\\b`);
            assert.ok(
                patron.test(js),
                `Falta "export function ${fn}(...)" en src/app.js`
            );
        }
    });

    it('Debe usar localStorage en guardar() o cargar()', () => {
        assert.ok(js, 'src/app.js no se pudo leer');
        assert.ok(
            /localStorage\.setItem/.test(js),
            'guardar() debe usar localStorage.setItem'
        );
        assert.ok(
            /localStorage\.getItem/.test(js),
            'cargar() debe usar localStorage.getItem'
        );
    });

    it('Debe usar JSON.stringify y JSON.parse', () => {
        assert.ok(js, 'src/app.js no se pudo leer');
        assert.ok(/JSON\.stringify/.test(js), 'Falta JSON.stringify para guardar');
        assert.ok(/JSON\.parse/.test(js), 'Falta JSON.parse para cargar');
    });

    it('Debe usar addEventListener', () => {
        assert.ok(js, 'src/app.js no se pudo leer');
        assert.ok(
            /addEventListener/.test(js),
            'Debes registrar al menos un event listener'
        );
    });
});

describe('No debe haber JavaScript inline', () => {
    it('index.html no debe tener atributos on* (onclick, onsubmit, etc.)', () => {
        const html = readFile('index.html');
        assert.ok(html, 'index.html no se pudo leer');
        const inlineHandlers = html.match(/\son[a-z]+=/gi);
        assert.ok(!inlineHandlers || inlineHandlers.length === 0,
            `Se encontraron handlers inline: ${inlineHandlers ? inlineHandlers.join(', ') : ''}`);
    });
});

// ===========================================================
// Tests funcionales con JSDOM
// Requieren que el estudiante haya implementado las funciones.
// ===========================================================

describe('Funciones del modelo (con JSDOM)', () => {
    let agregarTarea, eliminarTarea, toggleTarea, filtrarTareas, guardar, cargar, obtenerTareas;

    beforeEach(async () => {
        // Crear un DOM fresco para que cada test tenga localStorage limpio
        const dom = new JSDOM('<!doctype html><html><body><ul id="lista-tareas"></ul><p id="contador"></p></body></html>', {
            url: 'http://localhost/',
        });
        globalThis.window = dom.window;
        globalThis.document = dom.window.document;
        globalThis.localStorage = dom.window.localStorage;
        globalThis.HTMLElement = dom.window.HTMLElement;
        globalThis.Event = dom.window.Event;

        // Importar app.js ya con el DOM listo
        const url = pathToFileURL(resolve(root, 'src/app.js')).href;
        const mod = await import(`${url}?t=${Date.now()}`);
        agregarTarea = mod.agregarTarea;
        eliminarTarea = mod.eliminarTarea;
        toggleTarea = mod.toggleTarea;
        filtrarTareas = mod.filtrarTareas;
        guardar = mod.guardar;
        cargar = mod.cargar;
        obtenerTareas = mod.obtenerTareas;
    });

    afterEach(() => {
        delete globalThis.window;
        delete globalThis.document;
        delete globalThis.localStorage;
        delete globalThis.HTMLElement;
        delete globalThis.Event;
    });

    it('agregarTarea agrega una tarea válida', () => {
        const t = agregarTarea('Estudiar JS');
        assert.ok(t, 'Debe devolver la tarea creada');
        assert.strictEqual(t.texto, 'Estudiar JS');
        assert.strictEqual(t.completada, false);
        assert.ok(t.id, 'Debe tener un id');
        assert.strictEqual(obtenerTareas().length, 1);
    });

    it('agregarTarea rechaza texto vacío o solo espacios', () => {
        assert.strictEqual(agregarTarea(''), null);
        assert.strictEqual(agregarTarea('   '), null);
        assert.strictEqual(obtenerTareas().length, 0);
    });

    it('eliminarTarea elimina por id y devuelve true', () => {
        const t = agregarTarea('Comprar pan');
        const ok = eliminarTarea(t.id);
        assert.strictEqual(ok, true);
        assert.strictEqual(obtenerTareas().length, 0);
    });

    it('eliminarTarea devuelve false si no encuentra el id', () => {
        agregarTarea('Una tarea');
        const ok = eliminarTarea('id-inexistente');
        assert.strictEqual(ok, false);
    });

    it('toggleTarea cambia el estado completada', () => {
        const t = agregarTarea('Tarea X');
        assert.strictEqual(t.completada, false);
        const ok1 = toggleTarea(t.id);
        assert.strictEqual(ok1, true);
        const tareas1 = obtenerTareas();
        assert.strictEqual(tareas1[0].completada, true);
        toggleTarea(t.id);
        assert.strictEqual(obtenerTareas()[0].completada, false);
    });

    it('toggleTarea devuelve false si no encuentra el id', () => {
        agregarTarea('Algo');
        const ok = toggleTarea('no-existe');
        assert.strictEqual(ok, false);
    });

    it('filtrarTareas filtra por "todas", "pendientes" y "completadas"', () => {
        const a = agregarTarea('A');
        const b = agregarTarea('B');
        agregarTarea('C');
        toggleTarea(a.id);
        toggleTarea(b.id);

        const todas = filtrarTareas('todas');
        const pendientes = filtrarTareas('pendientes');
        const completadas = filtrarTareas('completadas');

        assert.strictEqual(todas.length, 3);
        assert.strictEqual(pendientes.length, 1);
        assert.strictEqual(completadas.length, 2);
    });

    it('guardar y cargar usan localStorage', () => {
        agregarTarea('Persistir esto');
        guardar();

        const raw = localStorage.getItem('tareas-dw-s4');
        assert.ok(raw, 'guardar() no escribió nada en localStorage');
        const data = JSON.parse(raw);
        assert.ok(Array.isArray(data), 'Lo guardado debe ser un array JSON');
        assert.strictEqual(data.length, 1);
        assert.strictEqual(data[0].texto, 'Persistir esto');

        // Vaciar el array en memoria y volver a cargar
        const tareasAntes = obtenerTareas().slice();
        // Simulamos que la página se recarga
        const mod = null;
        // Cargar de nuevo (lee del localStorage)
        cargar();
        const tareasDespues = obtenerTareas();
        assert.strictEqual(tareasDespues.length, tareasAntes.length);
        assert.strictEqual(tareasDespues[0].texto, 'Persistir esto');
    });
});
