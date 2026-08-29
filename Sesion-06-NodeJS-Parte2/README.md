# 📝 Tarea: Procesador de Logs con Streams y Testing

**Curso:** Desarrollo Web — Sesión 6 (Node.js Parte 2)
**Universidad:** Mariano Gálvez de Guatemala
**Docente:** Ing. Marco Tulio Valdez
**Duración:** 3–4 días · 30–45 min/día

## 🎯 Objetivo

Construir un **procesador de logs** que filtra líneas con Streams, organiza sus módulos con **ES Modules avanzado** (named/default exports y re-exports), usa **`import.meta.url`** para rutas y queda cubierto por **pruebas unitarias** con `node:test`. Aplicarás todo lo visto en la sesión 6.

## 📋 Lo que debes entregar

| Componente | Descripción |
|------------|-------------|
| **`src/math.js`** | Módulo con **named exports** (`PI`, `sumar`, `restar`) — ya listo |
| **`src/logger.js`** | Módulo con **default export** (`registrarProceso`) — ya listo |
| **`src/index.js`** | **Barrel exports**: re-exporta todo desde un solo punto — ya listo |
| **`src/app.js`** | Las funciones con TODOs que debes implementar |
| **`index.js`** | Punto de entrada que usa el barrel y filtra `data/app.log` |
| **`tests/grader.test.js`** | Pruebas unitarias (ya están listas) |

## 🧩 Regla del curso

> De aquí en adelante **todo ejemplo lleva sus pruebas unitarias o de integración**.
> Esta tarea ya las incluye: `npm test` verifica cada función que escribas.

## 🔨 Funciones a implementar (en `src/app.js`)

| Función | Tema de la sesión | Qué hace |
|---------|-------------------|----------|
| `filtrarLogs(origen, destino, texto)` | **Streams + pipeline** | Filtra líneas que contienen `texto` y las escribe en `destino`; devuelve cuántas coincidieron |
| `leerLineas(ruta)` | **Readable streams** | Devuelve las líneas de un archivo (sin vacías) |
| `rutaAbsoluta(rutaRelativa)` | **`import.meta.url`** | Combina `__dirname` con la ruta relativa |
| `parsearEnv(contenido)` | Node real | Parsea un `.env` simple (`CLAVE=VALOR`, ignora `#` y vacías) |

## 🗓️ Plan de 4 días

| Día | Actividad | Commit |
|-----|-----------|--------|
| 1 | Revisar los módulos (`math.js`, `logger.js`, `index.js`), entender las firmas y correr `npm test` | `chore: setup and review ES module structure` |
| 2 | Implementar `rutaAbsoluta` y `parsearEnv` | `feat: add path helpers and env parser` |
| 3 | Implementar `leerLineas` y `filtrarLogs` con streams | `feat: add stream-based log filtering` |
| 4 | Probar todo con `npm test` y `npm run dev`, revisar `index.js` | `feat: verify pipeline end to end` |

## 🚀 Cómo empezar

```bash
cd Sesion-06-NodeJS-Parte2

# Ver el arreglo de todos mis programas con sus pruebas
npm test

# Probar el filtrado de logs de ejemplo
npm run dev
```

## ✅ Cómo se califica

| Criterio | Peso |
|----------|------|
| **`npm test` pasa 100%** | 70% |
| **Conventional Commits** (mínimo 4, uno por día) | 20% |
| **Calidad de código** (nombres claros, sin `var`, comentarios útiles) | 10% |

Los tests verifican:
- ✓ Estructura de módulos (`math.js`, `logger.js`, `index.js`, `app.js`)
- ✓ package.json con `"type": "module"` y script `test`
- ✓ **Re-exports**: `sumar`, `restar`, `PI` y `registrarProceso` accesibles desde `src/index.js`
- ✓ `__dirname`/`__filename` con `import.meta.url` y `rutaAbsoluta()`
- ✓ `parsearEnv()` (líneas `CLAVE=VALOR`, comentarios `#`, vacías)
- ✓ `leerLineas()` con streams (sin líneas vacías, error si no existe)
- ✓ `filtrarLogs()` con `pipeline()` (coincidencias y cero coincidencias)

## 🆘 Tips

1. **`filtrarLogs`:** usa `createReadStream`, `Transform` + `pipeline`. Acumula líneas con un buffer y escribe las que coincidan.
2. **`leerLineas`:** crea un `createReadStream` y acumula los chunks; después divide por `\n` y filtra vacías.
3. **`rutaAbsoluta`:** usa `join(__dirname, rutaRelativa)`.
4. **`parsearEnv`:** divide el contenido por línea, ignora `#` y vacías, y separa por el primer `=`.
5. **El barrel `src/index.js` ya está hecho** — solo re-exporta. No lo rompas.