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
        // Buscamos el config.env subiendo un nivel desde src
        const texto = await readFile(join(__dirname, '..', 'config.env'), 'utf-8');
        return parsearEnv(texto);
    } catch {
        return { ARCHIVO_ORIGEN: 'data/app.log', ARCHIVO_DESTINO: 'data/filtrado.log', TEXTO: 'ERROR' };
    }
}

const config = await cargarConfig();

// Función auxiliar para limpiar rutas duplicadas y asegurar que salgan de 'src'
function normalizarRutaRaiz(rutaRelativa) {
    const limpia = rutaRelativa.replace(/^\.\.\//, ''); // Quita '../' si ya existía
    return join(__dirname, '..', limpia);
}

const origen = normalizarRutaRaiz(config.ARCHIVO_ORIGEN || 'data/app.log');
const destino = normalizarRutaRaiz(config.ARCHIVO_DESTINO || 'data/filtrado.log');

console.log(registrarProceso(`Ruta del proyecto: ${__dirname}`));
console.log(registrarProceso(`Filtrando '${config.TEXTO || 'ERROR'}' de ${join(origen)} → ${join(destino)}`));

const encontradas = await filtrarLogs(origen, destino, config.TEXTO || 'ERROR');
console.log(registrarProceso(`Líneas coincidentes: ${encontradas}`));
console.log(registrarProceso('Proceso terminado ✔'));