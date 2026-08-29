/**
 * logger.js — Módulo de registro (default export)
 * Tarea Sesión 6 · Desarrollo Web
 *
 * Devuelve un string con formato `[<fecha ISO>] <mensaje>`.
 */
export default function registrarProceso(msg) {
    return `[${new Date().toISOString()}] ${msg}`;
}