const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./foro.db', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        createTables(); // Llamar a la función para crear tablas al conectar
    }
});

// Función para crear las tablas
function createTables() {
    db.serialize(() => {
        // Crear tabla de usuarios
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error al crear la tabla de usuarios:', err.message);
            } else {
                console.log('Tabla "users" creada o ya existe.');
            }
        });

        // Crear tabla de imágenes
        db.run(`CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            text TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error al crear la tabla de imágenes:', err.message);
            } else {
                console.log('Tabla "images" creada o ya existe.');
            }
        });
    });
}

module.exports = db;