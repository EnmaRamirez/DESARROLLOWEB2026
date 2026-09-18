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
    try {
        const respuesta = await fetch(API);
        if (!respuesta.ok) throw new Error('Error al obtener la lista de alumnos');
        
        const alumnos = await respuesta.json();
        tabla.innerHTML = '';

        if (alumnos.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" style="text-align: center;">No hay alumnos registrados</td></tr>`;
            return;
        }

        alumnos.forEach(alumno => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${alumno.id}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.apellido}</td>
                <td>${alumno.email}</td>
                <td>${alumno.edad !== undefined && alumno.edad !== null ? alumno.edad : ''}</td>
                <td>
                    <button type="button" class="btn-editar" data-id="${alumno.id}">Editar</button>
                    <button type="button" class="btn-eliminar" data-id="${alumno.id}">Eliminar</button>
                </td>
            `;

            // Enlazar los handlers de evento usando las firmas exactas de la plantilla
            tr.querySelector('.btn-editar').addEventListener('click', () => abrirDialogoEditar(alumno.id));
            tr.querySelector('.btn-eliminar').addEventListener('click', () => eliminarAlumno(alumno.id));

            tabla.appendChild(tr);
        });
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}
  


/**
 * TODO: limpia el formulario, pone el título "Nuevo alumno",
 * idEnEdicion = null y abre dialogoForm con showModal().
 */
function abrirDialogoNuevo() {
    form.reset();
    idEnEdicion = null;
    tituloForm.textContent = 'Nuevo alumno';
    dialogoForm.showModal();
        
}

/**
 * TODO: precarga los datos del alumno en el formulario,
 * guarda su id en idEnEdicion, cambia el título a "Editar alumno"
 * y abre dialogoForm.
 */
async function abrirDialogoEditar(id) {
    try {
        const respuesta = await fetch(`${API}/${id}`);
        if (!respuesta.ok) throw new Error('No se pudo cargar la información del alumno');
        
        const alumno = await respuesta.json();
        idEnEdicion = id;
        tituloForm.textContent = 'Editar alumno';

        // Mapeo seguro a los campos del formulario
        form.querySelector('#nombre').value = alumno.nombre;
        form.querySelector('#apellido').value = alumno.apellido;
        form.querySelector('#email').value = alumno.email;
        form.querySelector('#edad').value = alumno.edad !== undefined && alumno.edad !== null ? alumno.edad : '';

        dialogoForm.showModal();
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}


/**
 * TODO: lee los campos del formulario y llama a la API.
 *   - Si idEnEdicion es null → POST /alumnos            (201)
 *   - Si hay id             → PUT /alumnos/:id          (200)
 * Usa cabeceras() y JSON.stringify(). Al terminar: cierra el dialog,
 * recarga la lista y muestra un mensaje.
 */
async function guardarAlumno(event) {
    event.preventDefault();

    const datos = {
        nombre: form.querySelector('#nombre').value,
        apellido: form.querySelector('#apellido').value,
        email: form.querySelector('#email').value,
        edad: form.querySelector('#edad').value  !== ''? Number(form.querySelector('#edad').value) : undefined
    };
    const esEdicion = idEnEdicion !== null;
    const url = esEdicion ? `${API}/${idEnEdicion}` : API;
    const metodo = esEdicion ? 'PUT' : 'POST';  
    
    try{
        const respuesta = await fetch(url, {
            method: metodo,
            headers: cabeceras(),
            body: JSON.stringify(datos)
        });
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.error || 'Error al procesar la solicitud');
        }
        dialogoForm.close();
        mostrarMensaje(esEdicion ? 'Alumno actualizado correctamente' : 'Alumno creado correctamente', 'ok');
        cargarAlumnos();
    }catch (error){
        mostrarMensaje(error.message, 'error');
    }
    
}

/**
 * TODO: abre dialogoEliminar guardando el id, y al confirmar hace
 * DELETE /alumnos/:id con cabeceras(false). Luego recarga y avisa.
 */
function eliminarAlumno(id) {
    idAEliminar = id;
    if (nombreEliminar) {
        // Opcional por si renderizas el contexto del nombre
        nombreEliminar.textContent = id;
    }
    dialogoEliminar.showModal();
}
function mostrarMensaje(texto, tipo) {
    if (!mensaje) return;
    mensaje.textContent = texto;

    mensaje.classList.remove('hidden', 'ok', 'error');
    mensaje.classList.add(tipo);

    setTimeout(() =>{
        mensaje.classList.add('hidden');
    }, 4000);
}

// ============================================================
// Conexión de eventos (TODO: completa lo que falte)
// ============================================================
// TODO: llamar cargarAlumnos() al iniciar

document.addEventListener('DOMContentLoaded', () => {
    // Botón "Nuevo alumno" → abrirDialogoNuevo()
    const btnNuevo = document.querySelector('#btnNuevo');
    if (btnNuevo) {
        btnNuevo.addEventListener('click', abrirDialogoNuevo);
    }

    // Form submit → guardarAlumno(event)
    if (form) {
        form.addEventListener('submit', guardarAlumno);
    }

    // Botón cancelar formulario
    const btnCancelarForm = document.querySelector('#btnCancelarForm');
    if (btnCancelarForm) {
        btnCancelarForm.addEventListener('click', () => dialogoForm.close());
    }

    // Botón cancelar eliminar
    const btnCancelarEliminar = document.querySelector('#btnCancelarEliminar');
    if (btnCancelarEliminar) {
        btnCancelarEliminar.addEventListener('click', () => dialogoEliminar.close());
    }

    // Botón confirmar eliminar → ejecutar el DELETE
    const btnConfirmarEliminar = document.querySelector('#btnConfirmarEliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', async () => {
            if (!idAEliminar) return;
            try {
                const respuesta = await fetch(`${API}/${idAEliminar}`, {
                    method: 'DELETE',
                    headers: cabeceras(false)
                });

                if (!respuesta.ok) throw new Error('No se pudo eliminar al alumno');

                dialogoEliminar.close();
                mostrarMensaje('Alumno eliminado correctamente', 'ok');
                idAEliminar = null;
                cargarAlumnos();
            } catch (error) {
                mostrarMensaje(error.message, 'error');
            }
        });
    }

    // Llamar cargarAlumnos() al iniciar
    cargarAlumnos();
});