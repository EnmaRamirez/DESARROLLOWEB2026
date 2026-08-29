import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Módulo del estudiante (cargado una sola vez)
let mod;
let tmpDir;

before(async () => {
    mod = await import(resolve(root, 'src/app.js'));
    tmpDir = mkdtempSync(join(tmpdir(), 'dw-s5-'));
});

// ===========================================================
// Estructura del proyecto
// ===========================================================
describe('Estructura del proyecto', () => {
    it('src/app.js debe existir', () => {
        assert.ok(existsSync(resolve(root, 'src/app.js')), 'src/app.js no encontrado');
    });

    it('index.js debe existir', () => {
        assert.ok(existsSync(resolve(root, 'index.js')), 'index.js no encontrado');
    });

    it('package.json debe existir y tener script de test', () => {
        const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
        assert.ok(pkg.scripts?.test, 'package.json no tiene script "test"');
    });

    it('src/app.js debe usar ES Modules (import)', () => {
        const src = readFileSync(resolve(root, 'src/app.js'), 'utf-8');
        assert.match(src, /^\s*import\s/m, 'No se usan imports ES Module');
    });

    it('src/app.js no debe usar var', () => {
        const src = readFileSync(resolve(root, 'src/app.js'), 'utf-8');
        assert.ok(!/\bvar\s/.test(src), 'src/app.js usa la palabra reservada var');
    });

    it('src/app.js debe exportar todas las funciones requeridas', () => {
        const esperadas = [
            'parsearArgumentos', 'obtenerConfig', 'infoSistema', 'crearLogger',
            'leerMensajes', 'agregarMensaje', 'crearServidor', 'iniciarServidor',
        ];
        for (const fn of esperadas) {
            assert.equal(typeof mod[fn], 'function', `Falta exportar la función ${fn}`);
        }
    });
});

// ===========================================================
// Funciones puras
// ===========================================================
describe('Argumentos y configuración', () => {
    it('parsearArgumentos usa valores por defecto', () => {
        assert.deepEqual(mod.parsearArgumentos([]), { nombre: 'invitado', puerto: 3000 });
    });

    it('parsearArgumentos lee --nombre y --puerto', () => {
        const r = mod.parsearArgumentos(['node', 'app.js', '--nombre', 'Ana', '--puerto', '8080']);
        assert.deepEqual(r, { nombre: 'Ana', puerto: 8080 });
    });

    it('obtenerConfig usa valores por defecto', () => {
        const c = mod.obtenerConfig({});
        assert.equal(c.puerto, 3000);
        assert.equal(c.nombreApp, 'mensajes-api');
        assert.equal(c.archivoDatos, 'data/mensajes.json');
    });

    it('obtenerConfig lee PORT, NOMBRE_APP y ARCHIVO_DATOS', () => {
        const c = mod.obtenerConfig({ PORT: '9090', NOMBRE_APP: 'miapi', ARCHIVO_DATOS: 'x.json' });
        assert.equal(c.puerto, 9090);
        assert.equal(c.nombreApp, 'miapi');
        assert.equal(c.archivoDatos, 'x.json');
    });
});

describe('Sistema y eventos', () => {
    it('infoSistema devuelve los datos del sistema', () => {
        const s = mod.infoSistema();
        assert.equal(typeof s.plataforma, 'string');
        assert.ok(s.nucleos > 0, 'nucleos debe ser > 0');
        assert.equal(typeof s.memoriaLibreMB, 'number');
        assert.equal(typeof s.hostname, 'string');
    });

    it('crearLogger emite eventos de registro', () => {
        const logger = mod.crearLogger();
        const recibidas = [];
        logger.onRegistro((linea) => recibidas.push(linea));
        logger.registrar('hola');
        assert.equal(recibidas.length, 1);
        assert.match(recibidas[0], /^\[.*\] hola$/);
    });
});

describe('Archivos (fs)', () => {
    it('leerMensajes devuelve [] si el archivo no existe', async () => {
        const arr = await mod.leerMensajes(join(tmpDir, 'no-existe.json'));
        assert.deepEqual(arr, []);
    });

    it('leerMensajes devuelve el arreglo guardado', async () => {
        const f = join(tmpDir, 'data.json');
        await writeFile(f, JSON.stringify([{ id: '1', texto: 'uno', fecha: 'x' }]));
        const arr = await mod.leerMensajes(f);
        assert.equal(arr.length, 1);
        assert.equal(arr[0].texto, 'uno');
    });

    it('leerMensajes devuelve [] si el contenido no es un arreglo', async () => {
        const f = join(tmpDir, 'obj.json');
        await writeFile(f, '{ "a": 1 }');
        assert.deepEqual(await mod.leerMensajes(f), []);
    });

    it('agregarMensaje crea el mensaje y lo persiste', async () => {
        const f = join(tmpDir, 'add.json');
        const nuevo = await mod.agregarMensaje(f, 'Mensaje 1');
        assert.ok(nuevo, 'agregarMensaje debe devolver el mensaje');
        assert.equal(nuevo.texto, 'Mensaje 1');
        assert.ok(nuevo.id && nuevo.fecha);
        const contenido = JSON.parse(await readFile(f, 'utf-8'));
        assert.equal(contenido.length, 1);
        assert.equal(contenido[0].texto, 'Mensaje 1');
    });

    it('agregarMensaje rechaza texto vacío o con espacios', async () => {
        const f = join(tmpDir, 'empty.json');
        assert.equal(await mod.agregarMensaje(f, '   '), null);
    });

    it('agregarMensaje crea el directorio si no existe', async () => {
        const f = join(tmpDir, 'anidado', 'sub', 'msg.json');
        const nuevo = await mod.agregarMensaje(f, 'Hola');
        assert.ok(nuevo);
        assert.ok(existsSync(f), 'No se creó el archivo en el directorio anidado');
    });
});

// ===========================================================
// Servidor HTTP (integración con fetch)
// ===========================================================
describe('Servidor HTTP (integración)', () => {
    let server;
    let baseUrl;
    let lineas;

    before(async () => {
        const dir = mkdtempSync(join(tmpdir(), 'dw-s5-srv-'));
        const archivoDatos = join(dir, 'msgs.json');
        await writeFile(archivoDatos, '[]', 'utf-8');

        lineas = [];
        const logger = mod.crearLogger();
        logger.onRegistro((linea) => lineas.push(linea));

        server = mod.crearServidor({ archivoDatos, nombreApp: 'test-api', logger });
        await new Promise((resolve) => server.listen(0, resolve));
        baseUrl = `http://127.0.0.1:${server.address().port}`;
    });

    after(() => {
        if (server) server.close();
    });

    it('GET / responde 200 con mensaje, hora y sistema', async () => {
        const res = await fetch(`${baseUrl}/`);
        assert.equal(res.status, 200);
        const body = await res.json();
        assert.ok(body.mensaje);
        assert.ok(body.hora);
        assert.ok(body.sistema?.hostname);
    });

    it('GET /mensajes devuelve un arreglo', async () => {
        const res = await fetch(`${baseUrl}/mensajes`);
        assert.equal(res.status, 200);
        assert.ok(Array.isArray(await res.json()));
    });

    it('POST /mensajes crea y persiste un mensaje', async () => {
        const res = await fetch(`${baseUrl}/mensajes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: 'Hola Node' }),
        });
        assert.equal(res.status, 201);
        const creado = await res.json();
        assert.equal(creado.texto, 'Hola Node');
        assert.ok(creado.id && creado.fecha);

        const getRes = await fetch(`${baseUrl}/mensajes`);
        const lista = await getRes.json();
        assert.ok(lista.some((m) => m.id === creado.id), 'El mensaje no quedó persistido');
    });

    it('POST /mensajes sin texto responde 400', async () => {
        const res = await fetch(`${baseUrl}/mensajes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: '' }),
        });
        assert.equal(res.status, 400);
    });

    it('una ruta inexistente responde 404', async () => {
        const res = await fetch(`${baseUrl}/no-existe`);
        assert.equal(res.status, 404);
    });

    it('el logger registra eventos de las peticiones', () => {
        assert.ok(lineas.length > 0, 'El logger debería haber registrado al menos un evento');
    });
});

