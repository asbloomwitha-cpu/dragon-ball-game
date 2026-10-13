import Swal from 'sweetalert2';

// Este archivo cambia lo que se ve en pantalla durante la partida.
// Guarda las pantallas del juego para poder mostrarlas u ocultarlas.
const pantallaSeleccion = document.getElementById('selection-stage');
const pantallaCarga = document.getElementById('loading-stage');
const pantallaCombate = document.getElementById('battle-stage');

const bannerTurno = document.getElementById('turno-banner');
const arenaJugador1 = document.getElementById('p1-arena');
const arenaJugador2 = document.getElementById('p2-arena');

// Guarda los elementos donde se muestran los datos del primer jugador.
const elementosJugador1 = {
    nombre: document.getElementById('username1'),
    personaje: document.getElementById('personaje1'),
    imagen: document.getElementById('img1'),
    vida: document.getElementById('p1-hp-bar'),
    textoVida: document.getElementById('p1-hp-text'),
    ki: document.getElementById('p1-ki-bar'),
    textoKi: document.getElementById('p1-ki-text'),
    energia: document.getElementById('p1-energy-bar'),
    textoEnergia: document.getElementById('p1-energy-text'),
    semillas: document.getElementById('p1-seed-text'),
    dialogo: document.getElementById('p1-dialogo-box')
};

// Guarda los elementos donde se muestran los datos del segundo jugador.
const elementosJugador2 = {
    nombre: document.getElementById('username2'),
    personaje: document.getElementById('personaje2'),
    imagen: document.getElementById('img2'),
    vida: document.getElementById('p2-hp-bar'),
    textoVida: document.getElementById('p2-hp-text'),
    ki: document.getElementById('p2-ki-bar'),
    textoKi: document.getElementById('p2-ki-text'),
    energia: document.getElementById('p2-energy-bar'),
    textoEnergia: document.getElementById('p2-energy-text'),
    semillas: document.getElementById('p2-seed-text'),
    dialogo: document.getElementById('p2-dialogo-box')
};

// Combate.js usa estas imágenes para mostrar las animaciones.
export const imagenJugador1 = elementosJugador1.imagen;
export const imagenJugador2 = elementosJugador2.imagen;

// Botones de movimientos de cada jugador.
const botonAtaqueBasicoJugador1 = document.getElementById('p1-btn-atk-basico');
const botonAtaqueEspecialJugador1 = document.getElementById('p1-btn-atk-especial');
const botonCargarEnergiaJugador1 = document.getElementById('p1-btn-carga');
const botonCuracionJugador1 = document.getElementById('p1-btn-curacion');

const botonAtaqueBasicoJugador2 = document.getElementById('p2-btn-atk-basico');
const botonAtaqueEspecialJugador2 = document.getElementById('p2-btn-atk-especial');
const botonCargarEnergiaJugador2 = document.getElementById('p2-btn-carga');
const botonCuracionJugador2 = document.getElementById('p2-btn-curacion');

const botonesJugador1 = [
    botonAtaqueBasicoJugador1,
    botonAtaqueEspecialJugador1,
    botonCargarEnergiaJugador1,
    botonCuracionJugador1
];

const botonesJugador2 = [
    botonAtaqueBasicoJugador2,
    botonAtaqueEspecialJugador2,
    botonCargarEnergiaJugador2,
    botonCuracionJugador2
];

// Muestra avisos, por ejemplo si falta un nombre o no alcanzan los recursos.
export function mostrarAlerta(mensaje, titulo = 'Atención', icono = 'warning') {
    Swal.fire({
        icon: icono,
        title: titulo,
        text: mensaje,
        confirmButtonColor: '#ff3366',
        background: '#141826',
        color: '#ffffff',
        customClass: {
            popup: 'dbz-swal-popup'
        }
    });
}

// Muestra una frase en la burbuja del jugador y la oculta después de unos segundos.
export function mostrarDialogo(numeroJugador, texto, duracion = 2500) {
    const contenedor = numeroJugador === 1 ? elementosJugador1.dialogo : elementosJugador2.dialogo;
    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = `<i class="fa-solid fa-comment-dots me-2"></i><span>"${texto}"</span>`;
    contenedor.classList.remove('d-none');
    contenedor.classList.add('dialogo-activo');

    setTimeout(() => {
        contenedor.classList.remove('dialogo-activo');
        setTimeout(() => {
            contenedor.classList.add('d-none');
        }, 300);
    }, duracion);
}

// Muestra en una ventana la imagen y la frase del movimiento que hizo el personaje.
export function mostrarAccionDelPersonaje(personaje, accion, texto, duracion = 1200) {
    let archivoAccion = accion;
    if (accion === 'inicio') {
        archivoAccion = 'base';
    }

    if (personaje === 'Veguetta' && accion === 'curar') {
        archivoAccion = 'curacion';
    }

    const nombresAccion = {
        inicio: 'entra al combate',
        basico: 'Ataque Básico',
        especial: 'Ataque Especial',
        energia: 'Carga de Ki',
        curar: 'Semilla del Ermitaño'
    };
    const nombreAccionTexto = nombresAccion[accion] || accion;
    const tituloModal = accion === 'inicio' ? `${personaje} entra al combate` : `${personaje} usa ${nombreAccionTexto}`;

    return Swal.fire({
        title: tituloModal,
        text: texto,
        imageUrl: `./public/img/${personaje}/${archivoAccion}.png`,
        imageAlt: `${personaje} en su movimiento`,
        imageWidth: 220,
        showConfirmButton: false,
        timer: duracion,
        timerProgressBar: true,
        background: '#141826',
        color: '#ffffff',
        customClass: {
            popup: 'dbz-swal-popup',
            ...(accion === 'inicio' ? { image: 'dbz-personaje-inicio' } : {})
        }
    });
}

// Agrega y luego quita el efecto visual que indica que el personaje recibió un golpe.
export function mostrarEfectoGolpe(imagen, duracion = 500) {
    imagen.classList.add('hit-effect');
    setTimeout(() => {
        imagen.classList.remove('hit-effect');
    }, duracion);
}

// Agrega y luego quita el brillo que aparece al curarse o cargar energía.
export function mostrarEfectoPoder(imagen, duracion = 700) {
    imagen.classList.add('power-effect');
    setTimeout(() => {
        imagen.classList.remove('power-effect');
    }, duracion);
}

// Desactiva los movimientos de los dos jugadores durante una animación o al terminar.
export function bloquearTodosLosBotones() {
    for (let i = 0; i < botonesJugador1.length; i++) {
        botonesJugador1[i].disabled = true;
        botonesJugador2[i].disabled = true;
    }
}

// Actualiza el anuncio del turno, resalta la arena y activa los botones permitidos.
export function actualizarTurno(turnoActual, turnosJugador1, turnosJugador2, nombreJugador1 = 'Jugador 1', nombreJugador2 = 'Jugador 2', accionEnProgreso = false) {
    if (accionEnProgreso) {
        bloquearTodosLosBotones();
        return;
    }

    // Actualizar banner visual del turno
    if (bannerTurno) {
        if (turnoActual === 1) {
            bannerTurno.className = 'turno-banner turno-p1 text-center py-2 px-3 mb-3';
            bannerTurno.innerHTML = `<i class="fa-solid fa-bolt me-2"></i>TURNO ACTUAL: <span class="fw-bold">${nombreJugador1.toUpperCase()}</span> (JUGADOR 1) <i class="fa-solid fa-bolt ms-2"></i>`;
        } else {
            bannerTurno.className = 'turno-banner turno-p2 text-center py-2 px-3 mb-3';
            bannerTurno.innerHTML = `<i class="fa-solid fa-fire me-2"></i>TURNO ACTUAL: <span class="fw-bold">${nombreJugador2.toUpperCase()}</span> (JUGADOR 2) <i class="fa-solid fa-fire ms-2"></i>`;
        }
    }

    // Resaltar la arena activa
    if (arenaJugador1 && arenaJugador2) {
        if (turnoActual === 1) {
            arenaJugador1.classList.add('arena-activa');
            arenaJugador1.classList.remove('arena-inactiva');
            arenaJugador2.classList.remove('arena-activa');
            arenaJugador2.classList.add('arena-inactiva');
        } else {
            arenaJugador2.classList.add('arena-activa');
            arenaJugador2.classList.remove('arena-inactiva');
            arenaJugador1.classList.remove('arena-activa');
            arenaJugador1.classList.add('arena-inactiva');
        }
    }

    // Control de botones de Jugador 1
    const esTurnoJugador1 = turnoActual === 1;
    botonAtaqueBasicoJugador1.disabled = !esTurnoJugador1;
    botonCargarEnergiaJugador1.disabled = !esTurnoJugador1;
    botonCuracionJugador1.disabled = !esTurnoJugador1;

    botonAtaqueEspecialJugador1.disabled = !esTurnoJugador1 || turnosJugador1 < 2;
    if (turnosJugador1 < 2) {
        botonAtaqueEspecialJugador1.innerHTML = `<i class="fa-solid fa-lock me-1"></i> Atk Especial <span class="badge bg-secondary ms-1">${turnosJugador1}/2</span>`;
        botonAtaqueEspecialJugador1.title = 'Se habilita después de completar tu 2do turno';
    } else {
        botonAtaqueEspecialJugador1.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles me-1"></i> Atk Especial <span class="badge bg-warning text-dark ms-1">¡LISTO!</span>`;
        botonAtaqueEspecialJugador1.title = '¡Ataque Especial disponible!';
    }

    const esTurnoJugador2 = turnoActual === 2;
    botonAtaqueBasicoJugador2.disabled = !esTurnoJugador2;
    botonCargarEnergiaJugador2.disabled = !esTurnoJugador2;
    botonCuracionJugador2.disabled = !esTurnoJugador2;

    botonAtaqueEspecialJugador2.disabled = !esTurnoJugador2 || turnosJugador2 < 2;
    if (turnosJugador2 < 2) {
        botonAtaqueEspecialJugador2.innerHTML = `<i class="fa-solid fa-lock me-1"></i> Atk Especial <span class="badge bg-secondary ms-1">${turnosJugador2}/2</span>`;
        botonAtaqueEspecialJugador2.title = 'Se habilita después de completar tu 2do turno';
    } else {
        botonAtaqueEspecialJugador2.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles me-1"></i> Atk Especial <span class="badge bg-warning text-dark ms-1">¡LISTO!</span>`;
        botonAtaqueEspecialJugador2.title = '¡Ataque Especial disponible!';
    }
}

// Copia a la pantalla la vida, el Ki, la energía y las semillas de un jugador.
function actualizarBarrasJugador(jugador, elementos) {
    const vida = jugador.getVida();
    const ki = jugador.getKi();
    const energia = jugador.getEnergia();
    const semillas = jugador.getSemilla();

    elementos.textoVida.innerText = `${vida}/100`;
    elementos.vida.style.width = `${vida}%`;

    elementos.textoKi.innerText = `${ki}/100`;
    elementos.ki.style.width = `${ki}%`;

    elementos.textoEnergia.innerText = `${energia}/100`;
    elementos.energia.style.width = `${energia}%`;

    elementos.semillas.innerText = semillas;
}

// Actualiza las barras y los números de ambos jugadores después de una acción.
export function actualizarEstadisticas(jugador1, jugador2) {
    if (jugador1) actualizarBarrasJugador(jugador1, elementosJugador1);
    if (jugador2) actualizarBarrasJugador(jugador2, elementosJugador2);
}

// Muestra los nombres, personajes e imágenes elegidos al entrar al combate.
export function mostrarParticipantes(jugador1, personaje1, jugador2, personaje2) {
    elementosJugador1.nombre.innerText = jugador1.getNombre().toUpperCase();
    elementosJugador1.personaje.innerText = personaje1.toUpperCase();
    elementosJugador1.imagen.src = `./public/img/${personaje1}/base.png`;

    elementosJugador2.nombre.innerText = jugador2.getNombre().toUpperCase();
    elementosJugador2.personaje.innerText = personaje2.toUpperCase();
    elementosJugador2.imagen.src = `./public/img/${personaje2}/base.png`;

    if (elementosJugador1.dialogo) elementosJugador1.dialogo.classList.add('d-none');
    if (elementosJugador2.dialogo) elementosJugador2.dialogo.classList.add('d-none');
}

// Oculta la selección y enseña la cuenta regresiva antes de que empiece el combate.
export function mostrarPantallaCarga() {
    pantallaSeleccion.classList.add('d-none');
    pantallaCombate.classList.add('d-none');
    pantallaCarga.classList.remove('d-none');
}

// Esconde la cuenta regresiva y muestra la arena de combate.
export function mostrarPantallaCombate() {
    pantallaCarga.classList.add('d-none');
    pantallaSeleccion.classList.add('d-none');
    pantallaCombate.classList.remove('d-none');
}

// Esconde el combate y vuelve a la selección de personajes.
export function volverASeleccion() {
    pantallaCombate.classList.add('d-none');
    pantallaCarga.classList.add('d-none');
    pantallaSeleccion.classList.remove('d-none');
}

// Muestra el resultado con la imagen del ganador y vuelve a la selección al cerrar.
export function mostrarVictoria(titulo, mensaje, personajeGanador, alCerrar) {
    bloquearTodosLosBotones();

    Swal.fire({
        title: titulo,
        html: `
            <div class="text-center my-3">
                <img src="./public/img/${personajeGanador}/base.png" style="max-height: 180px; filter: drop-shadow(0 0 20px #ffcc00);" alt="${personajeGanador}">
                <p class="mt-3 fs-5">${mensaje}</p>
            </div>
        `,
        icon: 'success',
        confirmButtonText: '<i class="fa-solid fa-rotate-left me-2"></i>Volver a Selección de Personajes',
        confirmButtonColor: '#ffcc00',
        background: '#141826',
        color: '#ffffff',
        allowOutsideClick: false,
        customClass: {
            popup: 'dbz-swal-popup'
        }
    }).then(() => {
        if (typeof alCerrar === 'function') {
            alCerrar();
        }
    });
}
