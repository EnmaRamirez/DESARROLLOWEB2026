/**
 * index.js — Punto de entrada del servidor
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * Uso:  pnpm start   (o)   pnpm run dev
 * Se carga configuración con: node --env-file=config.env src/index.js
 */

import { crearApp } from './app.js';
import { RepositorioAlumnos, datosSemilla } from './repositorio.js';

const PUERTO = process.env.PORT || 3000;

const repositorio = new RepositorioAlumnos(datosSemilla);
const app = crearApp(repositorio);

app.listen(PUERTO, () => {
    console.log(`🚀 API de alumnos:  http://localhost:${PUERTO}/alumnos`);
    console.log(`🌐 Sitio web:       http://localhost:${PUERTO}/`);
});
