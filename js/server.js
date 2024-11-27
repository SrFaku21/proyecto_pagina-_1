const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

// Middleware para manejar datos codificados en URL y JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Agrega esta línea para manejar solicitudes JSON
app.use(express.static(path.join(__dirname, '..', 'public'))); // Sirve archivos estáticos de la carpeta 'public'
app.use('/CSS', express.static(path.join(__dirname, '..', 'CSS'))); // Asegúrate de servir la carpeta CSS

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'principal.html'));
});

// Ruta para la página de registro
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'registro.html'));
});

// Manejar el registro de usuarios
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Hashear la contraseña
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send('Error al hashear la contraseña');
        }

        // Guardar el usuario en la base de datos con la contraseña hasheada
        db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hash], function(err) {
            if (err) {
                return res.status(400).send('Error al registrar el usuario: ' + err.message);
            }
            res.redirect('/'); // Redirige a la página principal después de registrar
        });
    });
});

// Ruta para la página de inicio de sesión
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// Manejar el inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            return res.status(400).send('Error en la consulta: ' + err.message);
        }
        if (!user) {
            return res.status(401).send('Usuario no encontrado');
        }

        // Comparar la contraseña ingresada con la hasheada
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).send('Error al comparar contraseñas');
            }
            if (!result) {
                return res.status(401).send('Contraseña incorrecta');
            }
            res.redirect('/'); // Redirige a la página principal después de iniciar sesión
        });
    });
});
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});