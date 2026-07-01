document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("login-form");

    if (formulario) {
        formulario.addEventListener("submit", (e) => {
            e.preventDefault(); // Detiene el envío y recarga de la página

            // Capturar los valores usando los nuevos IDs
            const correoLogin = document.getElementById("login-email").value.toLowerCase().trim();
            const contrasenaLogin = document.getElementById("login-password").value;
            const recordarMe = document.getElementById("login-remember").checked;

            // 1. Obtener la base de datos local de usuarios registrados
            const usuarios = JSON.parse(localStorage.getItem('usuariosHeadHunting')) || [];

            // 2. Buscar si existe el usuario con esa combinación de correo y contraseña
            const usuarioValido = usuarios.find(user => user.correo === correoLogin && user.contrasena === contrasenaLogin);

            if (usuarioValido) {
                // Si el usuario es correcto, decidimos el almacenamiento según el "Recordarme"
                const storageDestino = recordarMe ? localStorage : sessionStorage;
                storageDestino.setItem('sesionActiva', JSON.stringify(usuarioValido));

                window.location.href = "../app/dashboard.html";
            } else {
                // Alerta nativa en caso de credenciales erróneas
                alert("Correo o contraseña incorrectos");
            }
        });
    }
});
