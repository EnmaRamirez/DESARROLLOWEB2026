# 📝 Tarea: Lista de Tareas con JavaScript

**Curso:** Desarrollo Web — Sesión 4 (JavaScript Parte 1)
**Universidad:** Mariano Gálvez de Guatemala
**Docente:** Ing. Marco Tulio Valdez
**Duración:** 3–4 días · 30–45 min/día

## 🎯 Objetivo

Construir una **lista de tareas funcional** con JavaScript puro: agregar, completar, eliminar, filtrar y **persistir en `localStorage`**.

## 📋 Lo que debes entregar

| Componente | Descripción |
|------------|-------------|
| **`index.html`** | Estructura semántica: `<main>`, `<form>`, `<ul>`, `<nav>` de filtros |
| **`styles.css`** | Estilos base (incluidos) — puedes personalizarlos |
| **`src/app.js`** | Funciones del modelo y render del DOM |

### Funciones a implementar (en `src/app.js`)

| Función | Qué hace |
|---------|----------|
| `agregarTarea(texto)` | Crea una tarea, la agrega al array y la devuelve. `null` si el texto está vacío |
| `eliminarTarea(id)` | Quita la tarea con ese id. Devuelve `true`/`false` |
| `toggleTarea(id)` | Cambia `completada` de la tarea. Devuelve `true`/`false` |
| `filtrarTareas(filtro)` | Devuelve subconjunto: `"todas"`, `"pendientes"`, `"completadas"` |
| `guardar()` | Persiste el array en `localStorage` con la clave `tareas-dw-s4` |
| `cargar()` | Lee `localStorage` y repobla el array. Si no hay nada, queda vacío |

## 🗓️ Plan de 4 días

| Día | Actividad | Commit |
|-----|-----------|--------|
| 1 | Revisar HTML/CSS, enlazar `src/app.js` y leer el código | `chore: setup project and link app.js` |
| 2 | Implementar `agregarTarea`, `eliminarTarea` y `render` básico | `feat: add addTask, deleteTask and DOM rendering` |
| 3 | Implementar `toggleTarea` y `filtrarTareas`, conectar los botones | `feat: add toggle and filters` |
| 4 | Implementar `guardar` y `cargar` con `localStorage` | `feat: persist tasks with localStorage` |

## 🚀 Cómo empezar

```bash
# 1. Entra a esta carpeta
cd Sesion-04-JavaScript-Parte-1

# 2. Instala jsdom (necesario para los tests funcionales)
npm install

# 3. Corre los tests
npm test

# 4. Sirve la página en el navegador
npm run serve
# Abre http://localhost:8080
```

## ✅ Cómo se califica

| Criterio | Peso |
|----------|------|
| **`npm test` pasa 100%** | 70% |
| **Conventional Commits** (mínimo 4 commits válidos) | 20% |
| **Calidad de código** (HTML semántico, sin `var`, sin JS inline) | 10% |

### Qué verifican los tests

- ✓ `index.html`, `styles.css` y `src/app.js` existen
- ✓ HTML semántico con `<main>`, `<form>`, `<ul>`, `<label for="...">`
- ✓ 3 botones de filtro con `data-filtro`
- ✓ Sin handlers inline (`onclick`, etc.) — todo en `src/app.js`
- ✓ `src/app.js` usa `const`/`let` (no `var`)
- ✓ Exporta `agregarTarea`, `eliminarTarea`, `toggleTarea`, `filtrarTareas`, `guardar`, `cargar`
- ✓ Usa `localStorage`, `JSON.stringify` y `JSON.parse`
- ✓ Las funciones pasan los tests funcionales (con JSDOM)

## 📝 Conventional Commits — Ejemplos

```bash
# Día 1
git commit -m "chore: setup project and link app.js"

# Día 2
git commit -m "feat: add addTask and deleteTask with model and DOM rendering"

# Día 3
git commit -m "feat: add toggleTarea and filterTareas for completed/pending views"

# Día 4
git commit -m "feat: persist tasks in localStorage with JSON serialize"
git commit -m "fix: handle empty localStorage on first load"
```

## 📚 Recursos

- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
- [MDN: addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN: createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)

## ❓ ¿Dudas?

Revisa la presentación de la Sesión 4 o pregunta en clase. ¡Éxito! 🚀
