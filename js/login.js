const email = document.getElementById("email");
const pass = document.getElementById("password");
const form = document.getElementById("loginForm");
const parrafo = document.getElementById("warnings");

form.addEventListener("submit", e => {
    e.preventDefault();
    let warnings = "";
    let entrar = false;

    parrafo.innerHTML = "";
    if (!email.value) {
        warnings += `El correo es obligatorio <br>`;
        entrar = true;
    }
    if (!pass.value) {
        warnings += `La contraseña es obligatoria <br>`;
        entrar = true;
    }

    if (entrar) {
        parrafo.innerHTML = warnings;
    } else {
        form.submit(); // Si no hay errores, se envía el formulario
    }
});