import { describe, it, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

let app;
let index;
let tmpDir;
import { pathToFileURL } from 'node:url'; // Asegúrate de que esta línea esté arriba o úsala directo abajo

before(async () => {
    tmpDir = mkdtempSync(join(tmpdir(), 'dw-s6-'));
    // Convertimos las rutas absolutas a URL de archivo válidas para que funcione en Windows
    app = await import(pathToFileURL(resolve(root, 'src/app.js')).href);
    index = await import(pathToFileURL(resolve(root, 'src/index.js')).href);
});

// ===========================================================
// Estructura del proyecto
// ===========================================================
describe('Estructura del proyecto', () => {
    it('src/app.js debe existir', () => {
        assert.ok(existsSync(resolve(root, 'src/app.js')), 'src/app.js no encontrado');
    });

    it('src/math.js debe existir', () => {
        assert.ok(existsSync(resolve(root, 'src/math.js')), 'src/math.js no encontrado');
    });

    it('src/logger.js debe existir', () => {
        assert.ok(existsSync(resolve(root, 'src/logger.js')), 'src/logger.js no encontrado');
    });

    it('src/index.js (barrel) debe existir', () => {
        assert.ok(existsSync(resolve(root, 'src/index.js')), 'src/index.js no encontrado');
    });

    it('package.json debe ser type: module', () => {
        const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
        assert.equal(pkg.type, 'module');
        assert.ok(pkg.scripts?.test, 'package.json no tiene script "test"');
    });

    it('src/app.js debe exportar las funciones requeridas', () => {
        const esperadas = ['filtrarLogs', 'leerLineas', 'rutaAbsoluta', 'parsearEnv'];
        for (const fn of esperadas) {
            assert.equal(typeof app[fn], 'function', `Falta exportar ${fn}`);
        }
    });
});

// ===========================================================
// ES Modules: re-exports (barrel)
// ===========================================================
describe('ES Modules (barrel exports)', () => {
    it('src/index.js re-exporta sumar y restar de math.js', () => {
        assert.equal(typeof index.sumar, 'function');
        assert.equal(typeof index.restar, 'function');
    });

    it('src/index.js re-exporta PI de math.js', () => {
        assert.equal(index.PI, 3.14159);
    });

    it('src/index.js re-exporta registrarProceso de logger.js', () => {
        assert.equal(typeof index.registrarProceso, 'function');
    });

    it('sumar funciona', () => {
        assert.equal(index.sumar(2, 3), 5);
    });

    it('registrarProceso formatea el mensaje', () => {
        const linea = index.registrarProceso('hola');
        assert.match(linea, /^\[.*\] hola$/);
    });
});

// ===========================================================
// __dirname y rutaAbsoluta (import.meta.url)
// ===========================================================
describe('__dirname y rutas', () => {
    it('__dirname apunta a la carpeta src', () => {
        assert.match(app.__dirname, /src$/);
    });

    it('__filename apunta a app.js', () => {
        assert.match(app.__filename, /app\.js$/);
    });

    it('rutaAbsoluta combina con __dirname', () => {
        const r = app.rutaAbsoluta('data/app.log');
        assert.ok(r.startsWith(app.__dirname), 'La ruta debe partir de __dirname');
        assert.match(r, /app\.log$/);
    });
});

// ===========================================================
// parsearEnv
// ===========================================================
describe('parsearEnv', () => {
    it('parsea líneas CLAVE=VALOR', () => {
        const r = app.parsearEnv('PUERTO=8080\nNOMBRE=miapi\n');
        assert.equal(r.PUERTO, '8080');
        assert.equal(r.NOMBRE, 'miapi');
    });

    it('ignora líneas vacías y comentarios (#)', () => {
        const r = app.parsearEnv('# comentario\n\nPUERTO=3000\n');
        assert.deepEqual(r, { PUERTO: '3000' });
    });

    it('devuelve objeto vacío si no hay datos', () => {
        assert.deepEqual(app.parsearEnv(''), {});
        assert.deepEqual(app.parsearEnv('\n\n# solo comentarios\n'), {});
    });
});

// ===========================================================
// leerLineas (Readable)
// ===========================================================
describe('leerLineas', () => {
    it('lee líneas sin vacías', async () => {
        const f = join(tmpDir, 'lineas.txt');
        await writeFile(f, 'uno\ndos\n\n\ntres\n', 'utf-8');
        const lineas = await app.leerLineas(f);
        assert.deepEqual(lineas, ['uno', 'dos', 'tres']);
    });

    it('lanza error si el archivo no existe', async () => {
        await assert.rejects(() => app.leerLineas(join(tmpDir, 'no-existe.txt')));
    });
});

// ===========================================================
// filtrarLogs (Streams + pipeline)
// ===========================================================
describe('filtrarLogs', () => {
    let origen;
    let destino;

    beforeEach(async () => {
        const directorioLogs = join(tmpDir, 'logs');
        await mkdir(directorioLogs, { recursive: true });
        origen = join(directorioLogs, 'app.log');
        destino = join(directorioLogs, 'filtrado.log');
        await writeFile(
            origen,
            'INFO inicio\nERROR algo falló\nINFO ok\nERROR otro\n',
            'utf-8'
        );
    });

    it('filtra solo las líneas que contienen el texto', async () => {
        const total = await app.filtrarLogs(origen, destino, 'ERROR');
        assert.equal(total, 2);

        const contenido = await readFile(destino, 'utf-8');
        const lineas = contenido.split('\n').filter((l) => l.length > 0);
        assert.equal(lineas.length, 2);
        for (const l of lineas) {
            assert.match(l, /ERROR/);
        }
    });

    it('devuelve 0 si no hay coincidencias y crea archivo vacío', async () => {
        const total = await app.filtrarLogs(origen, destino, 'NOEXISTE');
        assert.equal(total, 0);
        assert.ok(existsSync(destino), 'Debe crear el archivo destino');
    });
});