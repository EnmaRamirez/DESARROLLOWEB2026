/**
 * repositorio.js — Repositorio en memoria de Alumnos
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * Responsabilidad: guardar y recuperar alumnos. NO conoce Express ni HTTP.
 * Esto es el patrón Repository que ya viste en clase: la capa de datos
 * queda aislada de la capa web.
 *
 * TODO: implementa los 5 métodos marcados. No cambies sus nombres ni firmas.
 */

/**
 * Datos iniciales para que la API arranque con información.
 * @typedef {{ id: string, nombre: string, apellido: string, email: string, edad: number }} Alumno
 * @type {Alumno[]}
 */
export const datosSemilla = [
    { id: 'a-1', nombre: 'Ana',    apellido: 'López',   email: 'ana.lopez@umg.edu.gt',    edad: 20 },
    { id: 'a-2', nombre: 'Luis',   apellido: 'Pérez',   email: 'luis.perez@umg.edu.gt',   edad: 22 },
    { id: 'a-3', nombre: 'Marta',  apellido: 'García',  email: 'marta.garcia@umg.edu.gt', edad: 21 },
];

export class RepositorioAlumnos {
    /**
     * @param {Alumno[]} alumnosIniciales
     */
    constructor(alumnosIniciales = []) {
        this.alumnos = alumnosIniciales.map((alumno) => ({ ...alumno }));
        this.siguienteId = this.alumnos.length + 1;
    }

    /**
     * Devuelve todos los alumnos.
     * @returns {Alumno[]}
     */
    listar() {
        throw new Error('TODO: implementar RepositorioAlumnos.listar()');
    }

    /**
     * Busca un alumno por id.
     * @param {string} id
     * @returns {Alumno | undefined}
     */
    obtener(id) {
        throw new Error('TODO: implementar RepositorioAlumnos.obtener()');
    }

    /**
     * Crea un alumno nuevo. El id lo genera el repositorio (`a-1`, `a-2`, ...).
     * @param {Omit<Alumno, 'id'>} datos
     * @returns {Alumno}
     */
    crear(datos) {
        throw new Error('TODO: implementar RepositorioAlumnos.crear()');
    }

    /**
     * Actualiza un alumno existente (solo los campos enviados).
     * @param {string} id
     * @param {Partial<Omit<Alumno, 'id'>>} datos
     * @returns {Alumno | undefined} el alumno actualizado, o undefined si no existe
     */
    actualizar(id, datos) {
        throw new Error('TODO: implementar RepositorioAlumnos.actualizar()');
    }

    /**
     * Elimina un alumno por id.
     * @param {string} id
     * @returns {boolean} true si lo eliminó, false si no existía
     */
    eliminar(id) {
        throw new Error('TODO: implementar RepositorioAlumnos.eliminar()');
    }
}
