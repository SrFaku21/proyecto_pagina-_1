const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../upload')); // Asegúrate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
        console.log('Archivo subido:', file.originalname); // Agrega esta línea
        cb(null, Date.now() + path.extname(file.originalname)); // Renombrar el archivo
    }
});
const upload = multer({ storage: storage });

const db = require('./database'); // Importa tu módulo de base de datos

// Ruta para manejar la subida de archivos
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo.');
    }
    const imageText = req.body.imageText; // Texto de la imagen
    const imageUrl = `/upload/${req.file.filename}`; // URL de la imagen

    console.log('URL de la imagen generada:', imageUrl); // Agrega esta línea

    try {
        // Guardar la imagen y el texto en la base de datos
        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO images (url, text) VALUES (?, ?)`, [imageUrl, imageText], function(err) {
                if (err) {
                    reject(err);
                    console.log("aca esta el error")
                } else {
                    resolve();
                }
            });
        });

        // Responder con la URL de la imagen y el texto
        res.json({ success: true, imageUrl: imageUrl, imageText: imageText });
    } catch (err) {
        console.error('Error al guardar la imagen en la base de datos:', err.message);
        res.status(500).send('Error al guardar la imagen en la base de datos');
    }
});

module.exports = router;