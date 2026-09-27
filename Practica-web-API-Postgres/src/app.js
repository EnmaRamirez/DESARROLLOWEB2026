import express from 'express';
import session from 'express-session';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Curso, Usuario, sequelize } from './db.js';

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_umg_2026';

// ============================================================================
// 🩺 ENDPOINT DE SALUD (Health Check)
// ============================================================================
app.get('/api/health', (req, res) => {
    res.status(200).json({ ok: true });
});

// ============================================================================
// 🗄️ ALMACENAMIENTO DE SESIONES EN MEMORIA (Ejercicio 5)
// ============================================================================
app.use(session({
    secret: 'secreto_sesion_umg',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 día de duración
}));

// ============================================================================
// 🔐 MIDDLEWARE: PROTECCIÓN CON JWT (Ejercicio 3)
// ============================================================================
function authJWT(req, res, next) {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. Token ausente.' });
    }
    const token = authHeader.split(' ')[1]; // Corrección para obtener el hash limpio
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
}

// ============================================================================
// 🪵 LOG ASÍNCRONO: PATRÓN FIRE-AND-FORGET (Ejercicio 6)
// ============================================================================
function registrarLogAsincrono(cursoId, accion) {
    // Se ejecuta en segundo plano sin retrasar la respuesta de la petición HTTP principal
    sequelize.query('INSERT INTO logs_auditoria (curso_id, accion, createdAt, updatedAt) VALUES (?, ?, datetime("now"), datetime("now"))', {
        replacements: [cursoId, accion]
    })
    .then(() => console.log(`[LOG SUCCESS]: Acción '${accion}' registrada para curso ${cursoId}`))
    .catch((err) => {
        // Si no existe la tabla de logs la crea de emergencia de forma silenciosa
        if (err.message.includes('no such table')) {
            sequelize.query('CREATE TABLE IF NOT EXISTS logs_auditoria (id INTEGER PRIMARY KEY AUTOINCREMENT, curso_id INTEGER, accion TEXT, createdAt TEXT, updatedAt TEXT)')
                .then(() => registrarLogAsincrono(cursoId, accion));
        } else {
            console.error(`[LOG ERROR]: Fallo en auditoría: ${err.message}`);
        }
    });
}

// ============================================================================
// 🛣️ ENDPOINTS DE LA API REST
// ============================================================================

// 4.1. Registrar un usuario con contraseña hasheada (Ejercicio 4)
app.post('/api/auth/registrar', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y clave son obligatorios' });

    try {
        const hash = await bcrypt.hash(password, 10);
        const nuevoUsuario = await Usuario.create({ email, passwordHash: hash });
        res.status(201).json({ id: nuevoUsuario.id, email: nuevoUsuario.email });
    } catch (err) {
        res.status(400).json({ error: 'El email ya se encuentra registrado.' });
    }
});

// 4.2. Iniciar sesión devolviendo un JWT (Ejercicio 4)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2.1. GET /cursos -> Listado completo (Ejercicio 2)
app.get('/api/cursos', async (req, res) => {
    try {
        const cursos = await Curso.findAll();
        res.status(200).json(cursos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2.2. POST /cursos -> Con validación por express-validator y protegido con JWT (Ejercicios 2 y 3)
app.post('/api/cursos',
    authJWT, 
    [
        body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
        body('codigo').trim().notEmpty().withMessage('El código único es obligatorio.'),
        body('creditos').isInt({ min: 0 }).withMessage('Créditos deben ser un entero >= 0.')
    ],
    async (req, res) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

        const { nombre, codigo, creditos } = req.body;
        try {
            const existente = await Curso.findOne({ where: { codigo } });
            if (existente) return res.status(409).json({ error: 'El código de curso ya existe.' });

            const nuevoCurso = await Curso.create({ nombre, codigo, creditos });

            // 🔥 Log Fire-and-forget en segundo plano (Ejercicio 6)
            registrarLogAsincrono(nuevoCurso.id, 'CREACION_CURSO');

            res.status(201).json(nuevoCurso);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

export { app };
