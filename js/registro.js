const nombre = document.getElementById("name");
const email = document.getElementById("email");
const pass = document.getElementById("password");
const form = document.getElementById("form");
const parrafo = document.getElementById("warnings");

form.addEventListener("submit", e => {
    e.preventDefault();
    let warnings = "";
    let entrar = false;
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    parrafo.innerHTML = "";

    // Validar que el nombre no esté vacío
    if (nombre.value.trim() === "") {
        warnings += `El nombre es obligatorio <br>`;
        entrar = true;
    }

    // // Validar que el nombre tenga más de 6 caracteres
    if (nombre.value.length < 6) {
        warnings += `El nombre debe tener más de 6 caracteres <br>`;
        entrar = true;
    }

    // Validar el correo electrónico
    if (!regexEmail.test(email.value)) {
        warnings += `El correo no es válido <br>`;
        entrar = true;
    }

    // Validar que la contraseña no esté vacía
    if (pass.value.trim() === "") {
        warnings += `La contraseña es obligatoria <br>`;
        entrar = true;
    } else if (pass.value.length < 8) {
        warnings += `La contraseña debe tener más de 8 caracteres <br>`;
        entrar = true;
    }

    // Mostrar advertencias si hay errores
    if (entrar) {
        parrafo.innerHTML = warnings;
    } else {
        // Si no hay errores, enviar los datos al servidor
        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nombre.value,
                email: email.value,
                password: pass.value
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al registrar el usuario');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Manejar la respuesta del servidor si es necesario
            window.location.href = '/'; // Redirigir a la página principal después del registro
        })
        .catch(error => {
            console.error('Error:', error);
            parrafo.innerHTML = `Error al registrar: ${error.message}`;
        });
    }
});