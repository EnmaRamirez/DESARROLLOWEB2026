/**
 * Lista de Tareas — JS Parte 1
 * Universidad Mariano Gálvez de Guatemala · Desarrollo Web
 *
 * Implementa las funciones marcadas con TODO para que los tests pasen.
 * No cambies los nombres exportados ni su firma.
 */

const STORAGE_KEY = "tareas-dw-s4";

// Estado en memoria (lo que se persiste y se renderiza)
let tareas = [];

/**
 * Devuelve todas las tareas. Útil para los tests.
 * @returns {Array<{id: string, texto: string, completada: boolean}>}
 */
export function obtenerTareas() {
    return tareas;
}

/**
 * Crea un id único para cada tarea.
 * @returns {string}
 */
export function generarId() {
    return `t-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

/**
 * Agrega una tarea al modelo.
 * @param {string} texto
 * @returns {{id: string, texto: string, completada: boolean} | null}
 *   La tarea creada, o null si el texto es vacío.
 */
export function agregarTarea(texto) {
    // TODO: validar que `texto` no esté vacío (trim), crear el objeto
    // { id, texto, completada: false }, hacer push al array `tareas`
    // y devolverlo. Si el texto es vacío, devolver null.
    if (!texto) return null;
    const textoLimpio = texto.trim();

    if (textoLimpio === ""){
        return null;
    }

    const tarea ={
        id: generarId(),
        texto: textoLimpio,
        completada: false

    };
    tareas.push(tarea);
    return tarea;

}

/**
 * Elimina una tarea por id. Devuelve true si la encontró y eliminó.
 * @param {string} id
 * @returns {boolean}
 */
export function eliminarTarea(id) {
    // TODO: filtrar `tareas` para quitar la que tenga ese id.
    // Devuelve true si eliminó al menos una, false si no.
    const cantidadInicial = tareas.length;

    tareas = tareas.filter((tarea)=> tarea.id !== id);
    return tareas.length < cantidadInicial;
}

/**
 * Marca/desmarca una tarea como completada. Devuelve true si la encontró.
 * @param {string} id
 * @returns {boolean}
 */
export function toggleTarea(id) {
    // TODO: recorrer `tareas` y cambiar `completada` de la que coincida.
    // Devuelve true si la encontró.
}

/**
 * Devuelve un subconjunto de tareas según el filtro.
 * @param {"todas"|"pendientes"|"completadas"} filtro
 * @returns {Array}
 */
export function filtrarTareas(filtro) {
    // TODO: implementar la lógica de filtrado.
}

/**
 * Persiste el array `tareas` en localStorage como JSON.
 */
export function guardar() {
    // TODO: usar localStorage.setItem con la clave STORAGE_KEY.
    // El valor debe ser JSON.stringify(tareas).
}

/**
 * Carga las tareas desde localStorage. Si no hay nada, deja el array vacío.
 */
export function cargar() {
    // TODO: leer localStorage con STORAGE_KEY.
    // Si existe, hacer JSON.parse y asignarlo a `tareas`.
    // Si no existe o falla, `tareas` se queda como [].
}

// =====================================================
// Renderizado y eventos (no se exportan, pero se prueban
// indirectamente con los tests que inspeccionan el DOM).
// =====================================================

/**
 * Pinta la lista de tareas en el DOM, aplicando el filtro activo.
 * @param {string} filtro - "todas" | "pendientes" | "completadas"
 */
export function render(filtro = "todas") {
    const lista = document.getElementById("lista-tareas");
    const contador = document.getElementById("contador");
    if (!lista) return;

    lista.innerHTML = "";
    const visibles = filtrarTareas(filtro);

    for (const tarea of visibles) {
        const li = document.createElement("li");
        if (tarea.completada) li.classList.add("completada");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarea.completada;
        checkbox.dataset.id = tarea.id;
        checkbox.setAttribute("aria-label", `Marcar "${tarea.texto}" como hecha`);
        checkbox.addEventListener("change", () => {
            toggleTarea(tarea.id);
            guardar();
            render(filtroActual);
        });

        const span = document.createElement("span");
        span.className = "texto";
        span.textContent = tarea.texto;

        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.className = "eliminar";
        btnEliminar.textContent = "✕";
        btnEliminar.setAttribute("aria-label", `Eliminar "${tarea.texto}"`);
        btnEliminar.addEventListener("click", () => {
            eliminarTarea(tarea.id);
            guardar();
            render(filtroActual);
        });

        li.append(checkbox, span, btnEliminar);
        lista.appendChild(li);
    }

    if (contador) {
        const total = tareas.length;
        const hechas = tareas.filter((t) => t.completada).length;
        contador.textContent = `${total} tarea${total === 1 ? "" : "s"} (${hechas} hechas)`;
    }
}

let filtroActual = "todas";

function init() {
    cargar();
    render(filtroActual);

    const form = document.getElementById("form-tarea");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = document.getElementById("input-tarea");
            const creada = agregarTarea(input.value);
            if (creada) {
                guardar();
                render(filtroActual);
                input.value = "";
                input.focus();
            }
        });
    }

    const botonesFiltro = document.querySelectorAll(".filtro");
    botonesFiltro.forEach((btn) => {
        btn.addEventListener("click", () => {
            filtroActual = btn.dataset.filtro;
            botonesFiltro.forEach((b) => b.classList.remove("activo"));
            btn.classList.add("activo");
            render(filtroActual);
        });
    });
}

// Solo inicializar cuando hay un DOM (no en tests con jsdom)
if (typeof document !== "undefined" && document.getElementById("lista-tareas")) {
    document.addEventListener("DOMContentLoaded", init);
}
