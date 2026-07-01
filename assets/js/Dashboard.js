const obtenerSesion = () => {
    const sesionLocal = localStorage.getItem('sesionActiva');
    const sesionTemporal = sessionStorage.getItem('sesionActiva');
    return JSON.parse(sesionLocal) || JSON.parse(sesionTemporal);
};

const limpiarSesion = () => {
    localStorage.removeItem('sesionActiva');
    sessionStorage.removeItem('sesionActiva');
};

if (!obtenerSesion()) {
    window.location.href = '../auth/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const baseDatos = {
        obtener: (clave) => {
            return JSON.parse(localStorage.getItem(clave)) || [];
        },
        guardar: (clave, valor) => {
            localStorage.setItem(clave, JSON.stringify(valor));
        }
    };

    const renderizarVistas = () => {
        const listaCandidatos = baseDatos.obtener('registroCandidatos');
        const listaVacantes = baseDatos.obtener('registroVacantes');
        const metricaCand = document.getElementById('metricaCandidatos');
        const metricaVac = document.getElementById('metricaVacantes');
        
        if (metricaCand) {
            metricaCand.textContent = `+ ${listaCandidatos.length + 2534}`;
        }
        
        if (metricaVac) {
            const vacantesAbiertas = listaVacantes.filter(v => v.estado === 'Abierta').length;
            metricaVac.textContent = vacantesAbiertas + 45;
        }

        const htmlAcciones = (id, tipo) => {
            return `
                <i class="fa-solid fa-pencil btn-action mx-1 accion-editar" data-id="${id}" data-tipo="${tipo}" title="Editar"></i>
                <i class="fa-solid fa-xmark btn-action mx-1 accion-eliminar" data-id="${id}" data-tipo="${tipo}" title="Eliminar"></i>
            `;
        };
        
        const cuerpoCandidatos = document.querySelector('#tablaCandidatos tbody');
        
        if (cuerpoCandidatos) {
            if (listaCandidatos.length > 0) {
                cuerpoCandidatos.innerHTML = listaCandidatos.map(cand => `
                    <tr>
                        <td>${cand.id}</td>
                        <td>${cand.nombre}</td>
                        <td>${cand.area}</td>
                        <td>${cand.correo}</td>
                        <td>${cand.fecha}</td>
                        <td>
                            <span class="badge proceso">${cand.estado}</span>
                        </td>
                        <td>${htmlAcciones(cand.id, 'candidato')}</td>
                    </tr>
                `).join('');
            } else {
                cuerpoCandidatos.innerHTML = `
                    <tr>
                        <td colspan="7">No existen candidatos registrados.</td>
                    </tr>
                `;
            }
        }
        
        const cuerpoVacantes = document.querySelector('#tablaVacantes tbody');
        
        if (cuerpoVacantes) {
            if (listaVacantes.length > 0) {
                cuerpoVacantes.innerHTML = listaVacantes.map(vac => `
                    <tr>
                        <td>${vac.id}</td>
                        <td>${vac.titulo}</td>
                        <td>${vac.cliente}</td>
                        <td>${vac.ubicacion}</td>
                        <td>
                            <span class="badge abierta">${vac.estado}</span>
                        </td>
                        <td>${vac.fecha}</td>
                        <td>${vac.postulantes || 0}</td>
                        <td>${htmlAcciones(vac.id, 'vacante')}</td>
                    </tr>
                `).join('');
            } else {
                cuerpoVacantes.innerHTML = `<tr><td colspan="8">No existen vacantes registradas.</td></tr>`;
            }
        }
        
        const cuerpoRecientes = document.querySelector('#tablaRecientes tbody');
    
        if (cuerpoRecientes) {
            const recientes = [...listaCandidatos].reverse().slice(0, 3);
        
            if (recientes.length > 0) {
                cuerpoRecientes.innerHTML = recientes.map(cand => `
                    <tr>
                        <td>${cand.id}</td>
                        <td>${cand.nombre}</td>
                        <td>${cand.area}</td>
                        <td>${cand.correo}</td>
                        <td>${cand.fecha}</td>
                        <td><span class="badge proceso">${cand.estado}</span></td>
                    </tr>
                `).join('');
            }
        }
    };

    document.body.addEventListener('click', (evento) => {
        const elementoClic = evento.target;
        const idElemento = elementoClic.dataset.id;
        const tipoElemento = elementoClic.dataset.tipo; 
        const claveAlmacenamiento = tipoElemento === 'candidato' ? 'registroCandidatos' : 'registroVacantes';
        
        if (elementoClic.classList.contains('btn-create')) {
            const idModalDestino = elementoClic.dataset.objetivo;
            const idFormulario = idModalDestino.replace('modal', 'formulario');
            const formularioAsignado = document.getElementById(idFormulario);
            
            if (formularioAsignado) {
                formularioAsignado.reset(); 
                
                if (idModalDestino === 'modalCandidato') {
                    document.getElementById('candidatoId').value = '';
                } else {
                    document.getElementById('vacanteId').value = '';
                }
                
                const modalBootstrap = document.getElementById(idModalDestino);
                new bootstrap.Modal(modalBootstrap).show();
            }
        }
        
        if (elementoClic.classList.contains('accion-eliminar')) {
            if (confirm('¿Desea eliminar este registro permanentemente?')) {
                const datosGuardados = baseDatos.obtener(claveAlmacenamiento);
                const datosFiltrados = datosGuardados.filter(item => item.id !== idElemento);
                baseDatos.guardar(claveAlmacenamiento, datosFiltrados); 
                renderizarVistas();
            }
        }
        
        if (elementoClic.classList.contains('accion-editar')) {
            const datosAEditar = baseDatos.obtener(claveAlmacenamiento).find(item => String(item.id) === String(idElemento));
            
            if (datosAEditar) {
                Object.keys(datosAEditar).forEach(propiedad => {
                    const propiedadCapitalizada = propiedad.charAt(0).toUpperCase() + propiedad.slice(1);
                    const idInputFormulario = `${tipoElemento}${propiedadCapitalizada}`;
                    const campoFormulario = document.getElementById(idInputFormulario);
                    
                    if (campoFormulario) {
                        campoFormulario.value = datosAEditar[propiedad];
                    }
                });
                
                const idModalActivo = tipoElemento === 'candidato' ? 'modalCandidato' : 'modalVacante';
                const contenedorModal = document.getElementById(idModalActivo);
                new bootstrap.Modal(contenedorModal).show();
            }
        }
    });

    const listaFormularios = ['formularioCandidato', 'formularioVacante'];
    
    listaFormularios.forEach(idFormulario => {
        const formularioActivo = document.getElementById(idFormulario);
        
        if (formularioActivo) {
            formularioActivo.addEventListener('submit', (evento) => {
                evento.preventDefault();
                
                const esCandidato = idFormulario === 'formularioCandidato';
                const claveAlmacenamiento = esCandidato ? 'registroCandidatos' : 'registroVacantes';
                const prefijoAtributo = esCandidato ? 'candidato' : 'vacante';
                const datosActuales = baseDatos.obtener(claveAlmacenamiento);
                const idIngresado = document.getElementById(`${prefijoAtributo}Id`).value;
                let idDefinitivo = idIngresado;
                
                if (!idDefinitivo) {
                    const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
                    idDefinitivo = esCandidato ? `C-${numeroAleatorio}` : numeroAleatorio;
                }
                
                let objetoGuardado;
                
                if (esCandidato) {
                    objetoGuardado = { 
                        id: idDefinitivo, 
                        nombre: document.getElementById('candidatoNombre').value, 
                        area: document.getElementById('candidatoArea').value, 
                        correo: document.getElementById('candidatoCorreo').value, 
                        estado: document.getElementById('candidatoEstado').value, 
                        fecha: idIngresado ? document.getElementById('candidatoFecha').value : new Date().toLocaleDateString('es-EC') 
                    };
                } else {
                    objetoGuardado = { 
                        id: idDefinitivo, 
                        titulo: document.getElementById('vacanteTitulo').value, 
                        cliente: document.getElementById('vacanteCliente').value, 
                        ubicacion: document.getElementById('vacanteUbicacion').value, 
                        estado: document.getElementById('vacanteEstado').value, 
                        fecha: idIngresado ? document.getElementById('vacanteFecha').value : new Date().toLocaleDateString('es-EC'), 
                        postulantes: idIngresado ? document.getElementById('vacantePostulantes').value : 0 
                    };
                }

                if (idIngresado) {
                    const indice = datosActuales.findIndex(item => String(item.id) === String(idDefinitivo));
                    
                    if (indice !== -1) {
                        datosActuales[indice] = objetoGuardado;
                    }
                } else {
                    datosActuales.push(objetoGuardado);
                }
                
                baseDatos.guardar(claveAlmacenamiento, datosActuales);
                const idModalFinal = esCandidato ? 'modalCandidato' : 'modalVacante';
                const elementoModal = document.getElementById(idModalFinal);
                const instanciaModal = bootstrap.Modal.getInstance(elementoModal);
                
                if (instanciaModal) {
                    instanciaModal.hide(); 
                }
                
                renderizarVistas();
            });
        }
    });

    const formConfig = document.getElementById('formularioConfiguracion');
    const inputConfigNombre = document.getElementById('configNombre');
    const inputConfigCorreo = document.getElementById('configCorreo');
    const inputConfigPassword = document.getElementById('configPassword');
    const sesionActiva = obtenerSesion();

    if (sesionActiva && formConfig) {
        inputConfigNombre.value = sesionActiva.nombre || '';
        inputConfigCorreo.value = sesionActiva.correo || '';
        formConfig.addEventListener('submit', (evento) => {
            evento.preventDefault();
            
            const nuevoNombre = inputConfigNombre.value.trim();
            const nuevaContrasena = inputConfigPassword.value;
            sesionActiva.nombre = nuevoNombre;
            
            if (nuevaContrasena.length >= 6) {
                sesionActiva.contrasena = nuevaContrasena;
            } else if (nuevaContrasena.length > 0 && nuevaContrasena.length < 6) {
                alert("La contraseña debe tener al menos 6 caracteres.");
                return;
            }
            
            if (localStorage.getItem('sesionActiva')) {
                localStorage.setItem('sesionActiva', JSON.stringify(sesionActiva));
            } else {
                sessionStorage.setItem('sesionActiva', JSON.stringify(sesionActiva));
            }
            
            const usuariosBd = JSON.parse(localStorage.getItem('usuariosHeadHunting')) || [];
            const indiceUsuario = usuariosBd.findIndex(u => u.correo === sesionActiva.correo);
            
            if (indiceUsuario !== -1) {
                usuariosBd[indiceUsuario] = sesionActiva;
                localStorage.setItem('usuariosHeadHunting', JSON.stringify(usuariosBd));
            }
            
            alert("¡Tus datos de configuración se han actualizado correctamente!");
            inputConfigPassword.value = ''; 
        });
    }

    const botonSalir = document.getElementById('enlaceCerrarSesion');
    
    if (botonSalir) {
        botonSalir.addEventListener('click', (evento) => {
            evento.preventDefault();
            limpiarSesion();
            window.location.href = '../auth/login.html';
        });
    }

    renderizarVistas();
});