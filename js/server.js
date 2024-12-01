const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const uploadRoutes = require('./subida_archivos'); // Importar rutas de subida

// const app = express();
// const PORT = 3000; port anterior modificacion pre creacion de script para subida de archivos

const app = express();
const PORT = process.env.PORT || 3000;

// Configura express-session
app.use(session({
    secret: 'tu_secreto_aqui', // Cambia esto por un secreto real
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Usa el router de upload
app.use(uploadRoutes); // Agrega las rutas de subida

// Servir la carpeta 'uploads' como recursos estáticos
app.use('/upload', express.static(path.join(__dirname, 'upload'))); // Asegúrate de que esta línea esté presente

// Middleware para manejar datos codificados en URL y JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Agrega esta línea para manejar solicitudes JSON
app.use(express.static(path.join(__dirname, '..', 'public'))); // Sirve archivos estáticos de la carpeta 'public'
app.use('/CSS', express.static(path.join(__dirname, '..', 'CSS'))); // Asegúrate de servir la carpeta CSS

// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            return res.status(400).send('Error en la consulta: ' + err.message);
        }
        if (!user) {
            return res.status(401).send('Usuario no encontrado');
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).send('Error al comparar contraseñas');
            }
            if (!result) {
                return res.status(401).send('Contraseña incorrecta');
            }

            // Almacena el nombre del usuario en la sesión
            req.session.username = user.name; // Almacena el nombre del usuario en la sesión
            res.redirect('/'); // Redirige a la página principal después de iniciar sesión
        });
    });
});

// Ruta para obtener el nombre de usuario
app.get('/api/username', (req, res) => {
    if (req.session.username) {
        res.json({ username: req.session.username }); // Devuelve el nombre de usuario en formato JSON
    } else {
        res.json({ username: null }); // Si no hay usuario autenticado, devuelve null
    }
});

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

    // Verificar si el correo ya está registrado
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, userByEmail) => {
        if (err) {
            return res.status(500).send('Error en la consulta: ' + err.message);
        }
        if (userByEmail) {
            return res.status(400).send('El correo ya está registrado'); // Mensaje de error
        }

        // Verificar si el nombre ya está registrado
        db.get(`SELECT * FROM users WHERE name = ?`, [name], (err, userByName) => {
            if (err) {
                return res.status(500).send('Error en la consulta: ' + err.message);
            }
            if (userByName) {
                return res.status(400).send('El nombre de usuario ya está en uso'); // Mensaje de error
            }

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