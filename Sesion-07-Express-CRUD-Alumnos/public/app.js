/**
 * app.js — Lógica del sitio (Fetch + Dialogs)
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * TODO: implementa las funciones marcadas. La API exige el header
 * `x-api-key` en las operaciones de escritura (POST, PUT, DELETE).
 */

const API = '/alumnos';
const API_KEY = 'umg-2026'; // debe coincidir con config.env

// Helper ya resuelto: cabeceras para las peticiones
const cabeceras = (conJson = true) => ({
    ...(conJson ? { 'Content-Type': 'application/json' } : {}),
    'x-api-key': API_KEY,
});

// Referencias del DOM (ya resueltas)
const tabla = document.querySelector('#tablaAlumnos tbody');
const mensaje = document.querySelector('#mensaje');
const dialogoForm = document.querySelector('#dialogoForm');
const dialogoEliminar = document.querySelector('#dialogoEliminar');
const form = document.querySelector('#formAlumno');
const tituloForm = document.querySelector('#tituloForm');
const nombreEliminar = document.querySelector('#nombreEliminar');

let idEnEdicion = null;        // null = crear | string = editar
let idAEliminar = null;

/**
 * TODO: GET /alumnos y pinta las filas en la tabla.
 * Cada fila debe incluir botones "Editar" y "Eliminar".
 */
async function cargarAlumnos() {
    throw new Error('TODO: implementar cargarAlumnos()');
}

/**
 * TODO: limpia el formulario, pone el título "Nuevo alumno",
 * idEnEdicion = null y abre dialogoForm con showModal().
 */
function abrirDialogoNuevo() {
    throw new Error('TODO: implementar abrirDialogoNuevo()');
}

/**
 * TODO: precarga los datos del alumno en el formulario,
 * guarda su id en idEnEdicion, cambia el título a "Editar alumno"
 * y abre dialogoForm.
 */
function abrirDialogoEditar(id) {
    throw new Error('TODO: implementar abrirDialogoEditar()');
}

/**
 * TODO: lee los campos del formulario y llama a la API.
 *   - Si idEnEdicion es null → POST /alumnos            (201)
 *   - Si hay id             → PUT /alumnos/:id          (200)
 * Usa cabeceras() y JSON.stringify(). Al terminar: cierra el dialog,
 * recarga la lista y muestra un mensaje.
 */
async function guardarAlumno(event) {
    throw new Error('TODO: implementar guardarAlumno()');
}

/**
 * TODO: abre dialogoEliminar guardando el id, y al confirmar hace
 * DELETE /alumnos/:id con cabeceras(false). Luego recarga y avisa.
 */
function eliminarAlumno(id) {
    throw new Error('TODO: implementar eliminarAlumno()');
}

/**
 * TODO: helper para mostrar mensajes (error en rojo, éxito en verde).
 */
function mostrarMensaje(texto, tipo = 'ok') {
    throw new Error('TODO: implementar mostrarMensaje()');
}

// ============================================================
// Conexión de eventos (TODO: completa lo que falte)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // TODO: botón "Nuevo alumno" → abrirDialogoNuevo()
    // TODO: form submit → guardarAlumno(event)
    // TODO: botón cancelar → dialogoForm.close()
    // TODO: botón cancelar eliminar → dialogoEliminar.close()
    // TODO: botón confirmar eliminar → ejecutar el DELETE
    // TODO: llamar cargarAlumnos() al iniciar
});
