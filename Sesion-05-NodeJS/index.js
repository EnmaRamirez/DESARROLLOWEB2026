/**
 * Punto de entrada — Tarea Sesión 5
 * Uso:  npm start   (o)   npm run dev  → node --watch
 */
import { iniciarServidor, obtenerConfig, infoSistema } from './src/app.js';

// Configuración desde variables de entorno (PORT, NOMBRE_APP, ARCHIVO_DATOS)
const config = obtenerConfig(process.env);

console.log(`🚀 Iniciando ${config.nombreApp} en el puerto ${config.puerto}`);
console.log('🖥️  Sistema:', infoSistema());

// Arranca el servidor (registra su URL en el logger)
iniciarServidor(config);

console.log('⏹️  Presiona Ctrl+C para detener.');
