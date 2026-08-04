# 📝 Tarea: Galería de Productos con CSS

**Curso:** Desarrollo Web — Sesión 3 (CSS)
**Universidad:** Mariano Gálvez de Guatemala
**Docente:** Ing. Marco Tulio Valdez
**Duración:** 3–4 días · 30–45 min/día

## 🎯 Objetivo

Construir una **galería de productos responsiva** usando **HTML semántico y CSS Grid/Flexbox** y un **layout de To-Do List** estilizado.

## 📋 Lo que debes entregar

| Componente | Descripción |
|-----------|-------------|
| **Galería de productos** | 6 tarjetas con imagen, nombre, precio y botón "Comprar" |
| **To-Do List** | Lista de tareas estilizada con checkboxes accesibles |

### Requisitos de la galería
- **Desktop (≥1024px):** 3 columnas con CSS Grid
- **Mobile (<768px):** 1 columna con scroll vertical
- Cada tarjeta debe tener: imagen con `alt`, nombre del producto, precio y botón "Comprar"
- El botón "Comprar" debe tener efecto `:hover`

## 🗓️ Plan de 3–4 días

| Día | Actividad | Commit |
|-----|-----------|--------|
| 1 | Estructura HTML + enlazar CSS externo | `chore: setup HTML structure and link CSS` |
| 2 | Estilos base: tarjetas, fuentes, colores, box model | `feat: add base styles for product cards` |
| 3 | Grid responsivo: 3 cols desktop, 1 col mobile + Todo List | `feat: add responsive grid and todo list styles` |
| 4 (opcional) | Pulir hover, transiciones, accesibilidad | `style: polish transitions and accessibility` |

> **Nota:** Puedes completar la tarea en 3 días. El día 4 es opcional para refinar.

## 🚀 Cómo empezar

```bash
# 1. Fork / clona este repo
git clone <tu-repo>
cd <carpeta>

# 2. No necesitas instalar dependencias (HTML + CSS puro)

# 3. Corre los tests para verificar tu progreso
npm test

# 4. Sirve tu página para verla en el navegador
npm run serve
# Abre http://localhost:8080
```

## ✅ Cómo se califica

| Criterio | Peso |
|----------|------|
| **`npm test` pasa 100%** | 70% |
| **Conventional Commits** (mínimo 3 commits) | 20% |
| **Calidad de código** (HTML semántico, CSS externo, sin inline) | 10% |

### Qué verifican los tests

- ✓ `index.html` existe y enlaza correctamente `styles.css`
- ✓ HTML semántico con `<article>`, `<section>`, `<main>`
- ✓ 6 artículos de producto con imagen, precio y botón "Comprar"
- ✓ CSS Grid con `grid-template-columns`
- ✓ `@media` query para diseño responsivo
- ✓ Botón "Comprar" con efecto `:hover`
- ✓ To-Do List con checkboxes y labels accesibles
- ✓ Sin CSS inline (todo en `styles.css`)

## 📝 Conventional Commits — Ejemplos

```bash
# Día 1: Setup
git commit -m "chore: setup HTML structure with semantic elements"

# Día 2: Estilos base
git commit -m "feat: add card styles with box model and typography"

# Día 3: Grid responsivo
git commit -m "feat: implement responsive grid with 3 cols desktop, 1 col mobile"
git commit -m "feat: add todo list with zebra striping"
git commit -m "fix: ensure vertical scroll on mobile gallery"

# Día 4 (opcional): Refinamiento
git commit -m "style: add hover transitions to buy button"
git commit -m "docs: add CSS comments explaining layout decisions"
```

## 📚 Recursos

- [CSS Grid Guide (CSS-Tricks)](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide (CSS-Tricks)](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [MDN: Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries)
- [MDN: CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)

## ❓ ¿Dudas?

Revisa la presentación de la Sesión 3 o pregunta en clase. ¡Éxito! 🚀
