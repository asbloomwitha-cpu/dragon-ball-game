// Carga Bootstrap, sus componentes de JavaScript, los iconos y los estilos del juego.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css';

// Importa la clase que crea a cada jugador con sus acciones de combate.
import Acciones from './Acciones.js';

// Importa funciones para mostrar avisos y cambiar entre las pantallas del juego.
import {
    mostrarAlerta,
    mostrarPantallaCarga,
    mostrarPantallaCombate,
    volverASeleccion
} from './interfaz.js';

// Importa funciones que preparan, inician y reinician la partida.
import {
    configurarControlesCombate,
    iniciarCombate,
    reiniciarCombate
} from './Combate.js';

// Guarda los botones para confirmar a cada jugador o volver a la selección.
const botonConfirmarJugador1 = document.getElementById('btn_player1');
const botonConfirmarJugador2 = document.getElementById('btn_player2');
const botonVolverSeleccion = document.getElementById('btn_back_to_selection');

// Guarda las zonas donde aparecen los retratos de cada jugador.
const contenedorPersonajesJugador1 = document.getElementById('py1');
const contenedorPersonajesJugador2 = document.getElementById('py2');

// Guarda los campos donde se escriben los nombres.
const inputNombreJugador1 = document.getElementById('player1');
const inputNombreJugador2 = document.getElementById('player2');

// Guarda el número grande que cambia durante la cuenta regresiva.
const contadorCarga = document.getElementById('loading-count');

// Aquí recordamos qué personaje eligió cada jugador.
let personajeJugador1 = '';
let personajeJugador2 = '';

// Al principio todavía no se han creado los objetos de los jugadores.
let jugador1 = null;
let jugador2 = null;

// Mientras escriben, deja solo letras y números en el campo del nombre.
function limpiarNombre(evento) {
    // "evento.target" es el campo que se está editando.
    // replace busca espacios y símbolos y los reemplaza por nada.
    evento.target.value = evento.target.value.replace(/[^a-zA-Z0-9]/g, '');
}

// Comprueba que el nombre tenga contenido y solo use letras y números.
function validarNombre(nombre, jugador) {
    // Si no se escribió nada, muestra un aviso y no deja continuar.
    if (nombre === '') {
        mostrarAlerta(`El ${jugador} debe ingresar un nombre.`);
        return false;
    }

    // Esta expresión comprueba que todos los caracteres sean letras o números.
    if (!/^[a-zA-Z0-9]+$/.test(nombre)) {
        mostrarAlerta(`El nombre del ${jugador} solo puede tener letras y números.`);
        return false;
    }

    // Si pasó las dos comprobaciones, el nombre sirve.
    return true;
}

// Marca el retrato elegido y guarda el nombre del personaje para el jugador correcto.
function seleccionarPersonaje(retratos, claseSeleccion, numeroJugador, retratoElegido) {
    // Si el Jugador 2 intenta elegir antes de que el Jugador 1 haya confirmado
    if (numeroJugador === 2 && jugador1 === null) {
        mostrarAlerta('El Jugador 1 debe confirmar a su guerrero antes de que el Jugador 2 pueda elegir.', 'Orden de selección');
        return;
    }

    // Lee el nombre del atributo del retrato; si no existe, usa su texto alternativo.
    const nombrePersonaje = retratoElegido.getAttribute('data-character') || retratoElegido.alt;

    // No deja que el jugador 2 elija el mismo personaje ya confirmado por el jugador 1.
    if (numeroJugador === 2 && jugador1 !== null && nombrePersonaje === personajeJugador1) {
        mostrarAlerta(`¡${nombrePersonaje} ya ha sido confirmado por el Jugador 1! Elige a otro guerrero.`, 'Selección no permitida');
        return;
    }

    // Quita la marca de la selección anterior.
    retratos.forEach(retrato => retrato.classList.remove(claseSeleccion));

    // Marca el nuevo retrato como seleccionado.
    retratoElegido.classList.add(claseSeleccion);

    // Guarda el nombre en la variable del jugador que hizo la elección.
    if (numeroJugador === 1) {
        personajeJugador1 = nombrePersonaje;
    } else {
        personajeJugador2 = nombrePersonaje;
    }
}

// Revisa los datos del jugador 1 y guarda su personaje para el combate.
function confirmarJugador1() {
    // trim quita espacios al principio y al final del nombre.
    const nombre = inputNombreJugador1.value.trim();

    // Si el nombre no sirve, termina esta función y espera a que lo corrijan.
    if (!validarNombre(nombre, 'Jugador 1')) {
        return;
    }

    // También hace falta que haya elegido un personaje.
    if (!personajeJugador1) {
        mostrarAlerta('¡El Jugador 1 debe seleccionar a un guerrero!', 'Personaje no seleccionado');
        return;
    }

    // Crea al jugador y guarda su nombre y sus recursos iniciales.
    jugador1 = new Acciones(nombre);
    // Oculta el botón para que no confirme varias veces.
    botonConfirmarJugador1.classList.add('d-none');
    // Bloquea el campo para que no cambie su nombre durante el combate.
    inputNombreJugador1.disabled = true;

    // Deshabilita visualmente en el panel del Jugador 2 el personaje elegido por el Jugador 1
    const retratosJugador2 = contenedorPersonajesJugador2.querySelectorAll('.char-portrait');
    retratosJugador2.forEach(retrato => {
        const nombre = retrato.getAttribute('data-character') || retrato.alt;
        if (nombre === personajeJugador1) {
            retrato.style.opacity = '0.35';
            retrato.style.filter = 'grayscale(100%)';
            retrato.style.cursor = 'not-allowed';
            retrato.title = 'Ya seleccionado por Jugador 1';
        }
    });

    // Desplaza la página hasta las opciones del jugador 2.
    document.getElementById('py2-container').scrollIntoView({ behavior: 'smooth' });
}

// Revisa los datos del jugador 2 y, si todo está bien, inicia la cuenta regresiva.
function confirmarJugador2() {
    // El jugador 1 debe confirmar antes que el jugador 2.
    if (jugador1 === null) {
        mostrarAlerta('El Jugador 1 debe confirmar su selección antes de continuar.', 'Orden de selección');
        return;
    }

    // Toma el nombre escrito, quitando espacios de los extremos.
    const nombre = inputNombreJugador2.value.trim();

    // Comprueba que el nombre tenga el formato permitido.
    if (!validarNombre(nombre, 'Jugador 2')) {
        return;
    }

    // No se puede empezar sin elegir un personaje.
    if (!personajeJugador2) {
        mostrarAlerta('¡El Jugador 2 debe seleccionar a un guerrero!', 'Personaje no seleccionado');
        return;
    }

    // Los dos jugadores deben usar personajes distintos.
    if (personajeJugador2 === personajeJugador1) {
        mostrarAlerta(`El personaje ${personajeJugador2} ya fue seleccionado por el Jugador 1. Por favor selecciona a otro guerrero.`, 'Guerrero duplicado');
        return;
    }

    // Crea al segundo jugador y bloquea sus datos mientras se juega.
    jugador2 = new Acciones(nombre);
    botonConfirmarJugador2.classList.add('d-none');
    inputNombreJugador2.disabled = true;

    // Oculta la selección y muestra la pantalla de espera.
    mostrarPantallaCarga();

    // La cuenta regresiva empieza en tres.
    let cuenta = 3;
    contadorCarga.innerText = cuenta;

    // Cada segundo resta uno y actualiza el número que se ve en pantalla.
    const intervaloCarga = setInterval(() => {
        cuenta--;
        contadorCarga.innerText = cuenta;

        // Cuando llega a cero, detiene el contador y abre el combate.
        if (cuenta <= 0) {
            clearInterval(intervaloCarga);
            mostrarPantallaCombate();
            // Empieza el combate y le pasa la función para volver a elegir personajes.
            iniciarCombate(jugador1, personajeJugador1, jugador2, personajeJugador2, regresarASeleccion);
        }
    }, 1000);
}

// Vuelve a la selección y deja el juego listo para una nueva partida.
export function regresarASeleccion() {
    // Muestra la selección y oculta las otras pantallas.
    volverASeleccion();

    // Deja listos los campos y botones para una nueva partida.
    botonConfirmarJugador1.classList.remove('d-none');
    botonConfirmarJugador2.classList.remove('d-none');
    inputNombreJugador1.disabled = false;
    inputNombreJugador2.disabled = false;
    inputNombreJugador1.value = '';
    inputNombreJugador2.value = '';

    // Busca todos los retratos y les quita la marca de selección y deshabilitado.
    const retratosJugador1 = contenedorPersonajesJugador1.querySelectorAll('.char-portrait');
    const retratosJugador2 = contenedorPersonajesJugador2.querySelectorAll('.char-portrait');
    retratosJugador1.forEach(retrato => retrato.classList.remove('selected-p1'));
    retratosJugador2.forEach(retrato => {
        retrato.classList.remove('selected-p2');
        retrato.style.opacity = '';
        retrato.style.filter = '';
        retrato.style.cursor = '';
        retrato.title = retrato.getAttribute('data-character') || retrato.alt;
    });

    // Borra los datos de la partida anterior.
    personajeJugador1 = '';
    personajeJugador2 = '';
    jugador1 = null;
    jugador2 = null;

    // También limpia los turnos y los datos guardados por el módulo de combate.
    reiniciarCombate();
}

// Cada vez que cambia un nombre, limpia los caracteres que no están permitidos.
inputNombreJugador1.addEventListener('input', limpiarNombre);
inputNombreJugador2.addEventListener('input', limpiarNombre);

// Busca los retratos del jugador 1 y prepara su selección con clic.
const retratosJugador1 = contenedorPersonajesJugador1.querySelectorAll('.char-portrait');
retratosJugador1.forEach(retrato => {
    // Al hacer clic, guarda el personaje si el jugador aún no confirmó.
    retrato.addEventListener('click', evento => {
        if (!jugador1) {
            // currentTarget es el retrato donde se hizo clic.
            seleccionarPersonaje(retratosJugador1, 'selected-p1', 1, evento.currentTarget);
        }
    });
});

// Hace lo mismo con los retratos del jugador 2.
const retratosJugador2 = contenedorPersonajesJugador2.querySelectorAll('.char-portrait');
retratosJugador2.forEach(retrato => {
    // Al hacer clic, guarda el personaje si el jugador aún no confirmó.
    retrato.addEventListener('click', evento => {
        if (!jugador2) {
            seleccionarPersonaje(retratosJugador2, 'selected-p2', 2, evento.currentTarget);
        }
    });
});

// Cuando se hace clic en cada botón, llama a la función correspondiente.
botonConfirmarJugador1.addEventListener('click', confirmarJugador1);
botonConfirmarJugador2.addEventListener('click', confirmarJugador2);
botonVolverSeleccion.addEventListener('click', regresarASeleccion);

// Prepara los botones de ataque, carga y curación para el combate.
configurarControlesCombate();
