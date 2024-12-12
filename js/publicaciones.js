// publicaciones.js

// Función para recuperar la información de las publicaciones desde la base de datos
function cargarPublicaciones() {
    db.all("SELECT * FROM images", (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        rows.forEach((row) => {
          const imageUrl = row.url;
          const imageText = row.text;
          displayImageAndText(imageUrl, imageText);
        });
      }
    });
  }
  
  // Exportar la función cargarPublicaciones
  export default cargarPublicaciones;