
let temporalRegistro = {
    nombre: "",
    correo: "",
    contrasena: "", 
    telefono: "",
    ciudadPais: "",
    tipoPerfil: "",
    habilidades: "",
    nivelEstudio: ""
};

document.addEventListener("DOMContentLoaded", () => {
    const btnSiguiente = document.getElementById("btn-siguiente-validar");
    const formulario = document.getElementById("registro-form");

    // VALIDACIÓN AL PASAR AL PASAR AL SIGUIENTE PASO
    if (btnSiguiente) {
        btnSiguiente.addEventListener("click", (e) => {
            const nombre = document.getElementById("reg-nombre").value.trim();
            const correo = document.getElementById("reg-correo").value.trim();
            const contrasena = document.getElementById("reg-password").value; 
            const telefono = document.getElementById("reg-telefono").value.trim();
            const ciudad = document.getElementById("reg-ciudad").value.trim();

            // Validar que los campos requeridos no estén vacíos
            if (!nombre || !correo || !contrasena || !telefono) {
                e.preventDefault(); 
                alert("Por favor, completa todos los campos obligatorios del Paso 1.");
                document.getElementById("paso1").checked = true;
                return;
            }

            // Máximo de 8 caracteres en password
            if (contrasena.length < 6) {
                e.preventDefault(); 
                alert("La contraseña debe contener mas de 6 digitos. Por favor, intentelo de nuevo.");
                document.getElementById("paso1").checked = true;
                return;
            }

            // Guardar en la estructura temporal si pasa los filtros
            temporalRegistro.nombre = nombre;
            temporalRegistro.correo = correo.toLowerCase();
            temporalRegistro.contrasena = contrasena; 
            temporalRegistro.telefono = telefono;
            temporalRegistro.ciudadPais = ciudad || "No especificada";
        });
    }

    //PROCESAMIENTO Y FINALIZACIÓN DEL REGISTRO 
    if (formulario) {
        formulario.addEventListener("submit", (e) => {
            e.preventDefault();

            const perfilSeleccionado = document.querySelector('input[name="perfil"]:checked');
            const estudioSeleccionado = document.querySelector('input[name="estudio"]:checked');
            const habilidades = document.getElementById("reg-habilidades").value.trim();

            temporalRegistro.tipoPerfil = perfilSeleccionado ? perfilSeleccionado.value : "No especificado";
            temporalRegistro.nivelEstudio = estudioSeleccionado ? estudioSeleccionado.value : "No especificado";
            temporalRegistro.habilidades = habilidades || "Ninguna";

            // Consultar base de datos de localStorage
            let usuarios = JSON.parse(localStorage.getItem('usuariosHeadHunting')) || [];

            // Validar que el correo no esté duplicado
            const correoDuplicado = usuarios.some(user => user.correo === temporalRegistro.correo);
            if (correoDuplicado) {
                alert("El correo electrónico ingresado ya se encuentra registrado.");
                return;
            }

            usuarios.push(temporalRegistro);
            localStorage.setItem('usuariosHeadHunting', JSON.stringify(usuarios));

            alert("¡Registro completado exitosamente!\nYa puedes iniciar sesión con tu correo y la contraseña que acabas de crear.");

            // Redireccionar al login
            window.location.href = "login.html";
        });
    }
});
