const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuración de multer para subir archivos
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/'); // Asegúrate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renombrar el archivo
    }
});
const upload = multer({ storage: storage });

// Ruta para manejar la subida de archivos
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo.');
    }
    const imageText = req.body.imageText; // Texto de la imagen
    const imageUrl = `/upload/${req.file.filename}`; // URL de la imagen, ajustado para la carpeta 'upload'

    // Responder con la URL de la imagen y el texto
    res.json({ success: true, imageUrl: imageUrl, imageText: imageText });
});

module.exports = router;