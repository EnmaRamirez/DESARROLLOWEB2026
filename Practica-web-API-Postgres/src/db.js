import { Sequelize, DataTypes } from 'sequelize';

// 🔌 Configuración limpia usando SQLite local para no necesitar instalar Postgres
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'universidad.sqlite', // Crea el archivo en tu carpeta automáticamente
    logging: false
});

// MODELO: Curso (Ejercicio 1)
const Curso = sequelize.define('Curso', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    codigo: { type: DataTypes.STRING, allowNull: false, unique: true }, 
    creditos: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'cursos' });

// MODELO: Usuario (Ejercicio 4)
const Usuario = sequelize.define('Usuario', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'usuarios' });

// Sincronizar de forma segura los modelos con las tablas locales
await sequelize.sync();

export { sequelize, Curso, Usuario };
