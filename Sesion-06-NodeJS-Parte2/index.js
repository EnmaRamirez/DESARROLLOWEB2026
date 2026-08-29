/**
 * Punto de entrada — Tarea Sesión 6
 * Uso:  npm start   (o)   npm run dev  → node --watch index.js
 */
import { filtrarLogs, rutaAbsoluta, parsearEnv, registrarProceso, __dirname } from './src/index.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Cargar configuración desde un .env de ejemplo (si existe)
async function cargarConfig() {
    try {
        const texto = await readFile(rutaAbsoluta('config.env'), 'utf-8');
        return parsearEnv(texto);
    } catch {
        return { ARCHIVO_ORIGEN: 'data/app.log', ARCHIVO_DESTINO: 'data/filtrado.log', TEXTO: 'ERROR' };
    }
}

const config = await cargarConfig();
const origen = rutaAbsoluta(config.ARCHIVO_ORIGEN || 'data/app.log');
const destino = rutaAbsoluta(config.ARCHIVO_DESTINO || 'data/filtrado.log');

console.log(registrarProceso(`Ruta del proyecto: ${__dirname}`));
console.log(registrarProceso(`Filtrando '${config.TEXTO || 'ERROR'}' de ${join(origen)} → ${join(destino)}`));

const encontradas = await filtrarLogs(origen, destino, config.TEXTO || 'ERROR');
console.log(registrarProceso(`Líneas coincidentes: ${encontradas}`));
console.log(registrarProceso('Proceso terminado ✔'));