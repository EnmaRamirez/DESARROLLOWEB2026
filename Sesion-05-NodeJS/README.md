# 📝 Tarea: Servidor HTTP con Node.js

**Curso:** Desarrollo Web — Sesión 5 (JavaScript en el servidor · Node.js)
**Universidad:** Mariano Gálvez de Guatemala
**Docente:** Ing. Marco Tulio Valdez
**Duración:** 3–4 días · 30–45 min/día

## 🎯 Objetivo

Construir una **API REST sencilla con Node.js puro** (sin frameworks) que lea y escriba mensajes en un archivo JSON, aplicando lo visto en la sesión 5: `process.argv`, variables de entorno, módulo `os`, `EventEmitter`, `fs` y el módulo `http`.

## 📋 Lo que debes entregar

| Componente | Descripción |
|------------|-------------|
| **`src/app.js`** | Las funciones del modelo y del servidor (implementa los TODOs) |
| **`index.js`** | Punto de entrada: lee la config y arranca el servidor |
| **`data/mensajes.json`** | Archivo donde se persisten los mensajes |

### Funciones a implementar (en `src/app.js`)

| Función | Qué hace |
|---------|----------|
| `parsearArgumentos(argv)` | Parsea `--nombre` y `--puerto` (defaults: `invitado`, `3000`) |
| `obtenerConfig(env)` | Lee `PORT`, `NOMBRE_APP`, `ARCHIVO_DATOS` de las variables de entorno |
| `infoSistema()` | Usa `os` para devolver plataforma, núcleos, memoria libre y hostname |
| `crearLogger()` | Devuelve `{ registrar, onRegistro }` basado en `EventEmitter` |
| `leerMensajes(archivoDatos)` | Devuelve el arreglo del archivo (o `[]` si no existe) |
| `agregarMensaje(archivoDatos, texto)` | Agrega y persiste un mensaje; `null` si el texto está vacío |
| `crearServidor(config)` | Crea el servidor HTTP con las rutas `GET /`, `GET /mensajes`, `POST /mensajes` |
| `iniciarServidor(config)` | Crea y arranca el servidor en `config.puerto` |

### Rutas del servidor

| Método | Ruta | Respuesta |
|--------|------|-----------|
| GET | `/` | `200` → `{ mensaje, hora, sistema }` |
| GET | `/mensajes` | `200` → arreglo de mensajes |
| POST | `/mensajes` | `201` → mensaje creado · `400` si falta `texto` |
| * | * | `404` → `{ error }` |

## 🗓️ Plan de 4 días

| Día | Actividad | Commit |
|-----|-----------|--------|
| 1 | Revisar `src/app.js`, `index.js` y el `package.json`; entender las firmas | `chore: setup project and review node structure` |
| 2 | Implementar `parsearArgumentos`, `obtenerConfig` e `infoSistema` | `feat: add CLI args, env config and system info` |
| 3 | Implementar `crearLogger`, `leerMensajes` y `agregarMensaje` | `feat: add EventEmitter logger and fs persistence` |
| 4 | Implementar `crearServidor` e `iniciarServidor`; probar con `npm run dev` | `feat: add http server routes and entry point` |

## 🚀 Cómo empezar

```bash
# 1. Entra a esta carpeta
cd Sesion-05-NodeJS

# 2. Corre los tests (van a fallar: aún faltan los TODOs)
npm test

# 3. Implementa los TODOs en src/app.js y vuelve a correr npm test
npm test

# 4. Arranca el servidor en desarrollo (se reinicia solo al guardar)
npm run dev
# Abre http://localhost:3000
```

También puedes probar la API con `curl`:

```bash
curl http://localhost:3000/
curl http://localhost:3000/mensajes
curl -X POST http://localhost:3000/mensajes \
  -H "Content-Type: application/json" \
  -d '{"texto":"Hola desde Node"}'
```

## ✅ Cómo se califica

| Criterio | Peso |
|----------|------|
| **`npm test` pasa 100%** | 70% |
| **Conventional Commits** (mínimo 4 commits válidos) | 20% |
| **Calidad de código** (ES Modules, sin `var`, JSDoc, `fs/promises`) | 10% |

### Qué verifican los tests

- ✓ Existen `src/app.js`, `index.js` y `package.json` con script `test`
- ✓ `src/app.js` usa ES Modules (`import`) y no usa `var`
- ✓ Exporta las 8 funciones requeridas
- ✓ `parsearArgumentos` y `obtenerConfig` (defaults y valores leídos)
- ✓ `infoSistema` devuelve los datos del sistema
- ✓ `crearLogger` emite eventos (`EventEmitter`)
- ✓ `leerMensajes` / `agregarMensaje` leen y escriben el archivo (y crean el directorio)
- ✓ El servidor HTTP responde `200/201/400/404` correctamente (integración con `fetch`)

## 📝 Conventional Commits — Ejemplos

```bash
# Día 1
git commit -m "chore: setup project and review node structure"

# Día 2
git commit -m "feat: add CLI args, env config and system info helpers"

# Día 3
git commit -m "feat: add EventEmitter logger and fs persistence"

# Día 4
git commit -m "feat: add http server routes and entry point"
git commit -m "fix: create data directory if it does not exist"
```

## 📚 Recursos

- [Node.js: guía de módulos](https://nodejs.org/api/)
- [node:http](https://nodejs.org/api/http.html) · [node:fs](https://nodejs.org/api/fs.html) · [node:events](https://nodejs.org/api/events.html) · [node:os](https://nodejs.org/api/os.html)
- [process.argv](https://nodejs.org/api/process.html#processargv) · [Variables de entorno](https://nodejs.org/api/process.html#processenv)
- [node --watch](https://nodejs.org/api/cli.html#--watch)

## ❓ ¿Dudas?

Revisa la presentación de la Sesión 5 o pregunta en clase. ¡Éxito! 🚀
