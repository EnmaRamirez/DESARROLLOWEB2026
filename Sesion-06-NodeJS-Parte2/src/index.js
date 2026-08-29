/**
 * index.js — Punto de re-export (barrel exports)
 * Tarea Sesión 6 · Desarrollo Web
 *
 * Centraliza toda la API pública del proyecto en un solo módulo.
 */

// Re-export de los módulos de utilidades
export { PI, sumar, restar } from './math.js';
export { default as registrarProceso } from './logger.js';

// Re-export de las funciones principales de app.js
export {
    filtrarLogs,
    leerLineas,
    rutaAbsoluta,
    parsearEnv,
    generarId,
    __filename,
    __dirname,
} from './app.js';