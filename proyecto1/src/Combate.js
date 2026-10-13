// Este archivo coordina los turnos y los movimientos durante la partida.
import {
    mostrarAlerta,
    mostrarAccionDelPersonaje,
    mostrarDialogo,
    mostrarEfectoGolpe,
    mostrarEfectoPoder,
    actualizarTurno,
    actualizarEstadisticas,
    mostrarParticipantes,
    mostrarVictoria,
    bloquearTodosLosBotones,
    imagenJugador1,
    imagenJugador2
} from './interfaz.js';

import { obtenerDialogo } from './Dialogos.js';

// Botones que permiten a cada jugador hacer sus movimientos.
const botonAtaqueBasicoJugador1 = document.getElementById('p1-btn-atk-basico');
const botonAtaqueEspecialJugador1 = document.getElementById('p1-btn-atk-especial');
const botonCargarEnergiaJugador1 = document.getElementById('p1-btn-carga');
const botonCuracionJugador1 = document.getElementById('p1-btn-curacion');

const botonAtaqueBasicoJugador2 = document.getElementById('p2-btn-atk-basico');
const botonAtaqueEspecialJugador2 = document.getElementById('p2-btn-atk-especial');
const botonCargarEnergiaJugador2 = document.getElementById('p2-btn-carga');
const botonCuracionJugador2 = document.getElementById('p2-btn-curacion');

let jugador1 = null;
let jugador2 = null;
let personajeJugador1 = '';
let personajeJugador2 = '';

let turnoActual = 1;
let turnosJugador1 = 0;
let turnosJugador2 = 0;
let hayUnaAccionEnProgreso = false;
let partidaTerminada = false;
let funcionVolverASeleccion = null;

// Guarda a los jugadores, presenta a sus personajes y comienza con el turno del jugador 1.
export async function iniciarCombate(jugadorUno, personajeUno, jugadorDos, personajeDos, funcionParaVolverASeleccion) {
    jugador1 = jugadorUno;
    personajeJugador1 = personajeUno;
    jugador2 = jugadorDos;
    personajeJugador2 = personajeDos;
    funcionVolverASeleccion = funcionParaVolverASeleccion;

    turnoActual = 1;
    turnosJugador1 = 0;
    turnosJugador2 = 0;
    hayUnaAccionEnProgreso = false;
    partidaTerminada = false;

    mostrarParticipantes(jugador1, personajeJugador1, jugador2, personajeJugador2);
    actualizarEstadisticas(jugador1, jugador2);
    hayUnaAccionEnProgreso = true;
    actualizarTurno(turnoActual, turnosJugador1, turnosJugador2, jugador1.getNombre(), jugador2.getNombre(), true);

    const dialogoInicioJugador1 = obtenerDialogo(personajeJugador1, 'inicio');
    await mostrarAccionDelPersonaje(personajeJugador1, 'inicio', dialogoInicioJugador1, 2000);

    if (!partidaTerminada) {
        const dialogoInicioJugador2 = obtenerDialogo(personajeJugador2, 'inicio');
        await mostrarAccionDelPersonaje(personajeJugador2, 'inicio', dialogoInicioJugador2, 2000);
    }

    if (!partidaTerminada) {
        hayUnaAccionEnProgreso = false;
        actualizarTurno(turnoActual, turnosJugador1, turnosJugador2, jugador1.getNombre(), jugador2.getNombre(), false);
    }
}

// Borra los jugadores, los turnos y el estado anterior para empezar otra partida.
export function reiniciarCombate() {
    jugador1 = null;
    jugador2 = null;
    personajeJugador1 = '';
    personajeJugador2 = '';
    turnoActual = 1;
    turnosJugador1 = 0;
    turnosJugador2 = 0;
    hayUnaAccionEnProgreso = false;
    partidaTerminada = false;
    funcionVolverASeleccion = null;
    bloquearTodosLosBotones();
}

// Después de un ataque, revisa si alguien llegó a cero de vida y muestra al ganador.
function revisarSiTerminoElCombate() {
    if (jugador1.getVida() <= 0) {
        partidaTerminada = true;
        bloquearTodosLosBotones();

        const dialogoDerrota = obtenerDialogo(personajeJugador1, 'derrota');
        mostrarDialogo(1, dialogoDerrota, 2500);

        setTimeout(() => {
            mostrarVictoria(
                `¡VICTORIA PARA ${jugador2.getNombre().toUpperCase()}!`,
                `${jugador1.getNombre()} (${personajeJugador1}) ha sido derrotado. ¡${jugador2.getNombre()} (${personajeJugador2}) es el campeón!`,
                personajeJugador2,
                () => {
                    if (typeof funcionVolverASeleccion === 'function') {
                        funcionVolverASeleccion();
                    }
                }
            );
        }, 1500);
        return true;
    }

    if (jugador2.getVida() <= 0) {
        partidaTerminada = true;
        bloquearTodosLosBotones();

        const dialogoDerrota = obtenerDialogo(personajeJugador2, 'derrota');
        mostrarDialogo(2, dialogoDerrota, 2500);

        setTimeout(() => {
            mostrarVictoria(
                `¡VICTORIA PARA ${jugador1.getNombre().toUpperCase()}!`,
                `${jugador2.getNombre()} (${personajeJugador2}) ha sido derrotado. ¡${jugador1.getNombre()} (${personajeJugador1}) es el campeón!`,
                personajeJugador1,
                () => {
                    if (typeof funcionVolverASeleccion === 'function') {
                        funcionVolverASeleccion();
                    }
                }
            );
        }, 1500);
        return true;
    }

    return false;
}

// Termina la acción actual, cuenta el turno y deja jugar al otro jugador.
function terminarTurno(numeroJugadorQueActuo) {
    if (numeroJugadorQueActuo === 1) {
        turnosJugador1++;
        turnoActual = 2;
    } else {
        turnosJugador2++;
        turnoActual = 1;
    }

    hayUnaAccionEnProgreso = false;
    actualizarTurno(turnoActual, turnosJugador1, turnosJugador2, jugador1.getNombre(), jugador2.getNombre(), false);
}

// Revisa los recursos, realiza el ataque básico, muestra su efecto y pasa el turno.
function ejecutarAtaqueBasico(numeroJugador) {
    if (partidaTerminada || hayUnaAccionEnProgreso || turnoActual !== numeroJugador) {
        return;
    }

    const atacante = numeroJugador === 1 ? jugador1 : jugador2;
    const defensor = numeroJugador === 1 ? jugador2 : jugador1;
    const personajeAtacante = numeroJugador === 1 ? personajeJugador1 : personajeJugador2;
    const imagenDefensor = numeroJugador === 1 ? imagenJugador2 : imagenJugador1;

    const validacion = atacante.puedeHacerAtaqueBasico();
    if (!validacion.puede) {
        mostrarAlerta(validacion.razon);
        return;
    }

    hayUnaAccionEnProgreso = true;
    actualizarTurno(turnoActual, turnosJugador1, turnosJugador2, jugador1.getNombre(), jugador2.getNombre(), true);

    atacante.hacerAtaqueBasico(defensor);

    const dialogoAtaque = obtenerDialogo(personajeAtacante, 'basico');
    mostrarAccionDelPersonaje(personajeAtacante, 'basico', dialogoAtaque, 1200);

    setTimeout(() => {
        mostrarEfectoGolpe(imagenDefensor, 500);
        actualizarEstadisticas(jugador1, jugador2);
    }, 300);

    setTimeout(() => {
        if (!revisarSiTerminoElCombate()) {
            terminarTurno(numeroJugador);
        }
    }, 1200);
}

// Revisa que hayan pasado dos turnos y suficientes recursos antes del ataque especial.
function ejecutarAtaqueEspecial(numeroJugador) {
    if (partidaTerminada || hayUnaAccionEnProgreso || turnoActual !== numeroJugador) {
        return;
    }

    const atacante = numeroJugador === 1 ? jugador1 : jugador2;
    const defensor = numeroJugador === 1 ? jugador2 : jugador1;
    const personajeAtacante = numeroJugador === 1 ? personajeJugador1 : personajeJugador2;
    const turnosJugador = numeroJugador === 1 ? turnosJugador1 : turnosJugador2;
    const imagenDefensor = numeroJugador === 1 ? imagenJugador2 : imagenJugador1;

    if (turnosJugador < 2) {
        mostrarAlerta(
            `El Ataque Especial solo se habilita después de completar el segundo turno de este guerrero. Actualmente llevas ${turnosJugador} de 2 turnos necesarios.`,
            'Ataque Especial Bloqueado'
        );
        return;
    }

    const validacion = atacante.puedeHacerAtaqueEspecial();
    if (!validacion.puede) {
        mostrarAlerta(validacion.razon);
        return;
    }

    hayUnaAccionEnProgreso = true;
    actualizarTurno(turnoActual, turnosJugador1, turnosJugador2, jugador1.getNombre(), jugador2.getNombre(), true);

    atacante.hacerAtaqueEspecial(defensor);

    const dialogoEspecial = obtenerDialogo(personajeAtacante, 'especial');
    mostrarAccionDelPersonaje(personajeAtacante, 'especial', dialogoEspecial, 1400);

    setTimeout(() => {
        mostrarEfectoGolpe(imagenDefensor, 700);
        actualizarEstadisticas(jugador1, jugador2);
    }, 500);

    setTimeout(() => {
        if (!revisarSiTerminoElCombate()) {
            terminarTurno(numeroJugador);
        }
    }, 1400);
}

// Recupera Ki y energía, actualiza la pantalla y luego pasa el turno.
function ejecutarCargaEnergia(numeroJugador) {
    if (partidaTerminada || hayUnaAccionEnProgreso || turnoActual !== numeroJugador) {
        return;
    }

    const atacante = numeroJugador === 1 ? jugador1 : jugador2;
    const personajeAtacante = numeroJugador === 1 ? personajeJugador1 : personajeJugador2;
    const imagenAtacante = numeroJugador === 1 ? imagenJugador1 : imagenJugador2;

    hayUnaAccionEnProgreso = true;
    actualizarTurno(turnoActual, turnosJugador1, turnosJugador2, jugador1.getNombre(), jugador2.getNombre(), true);

    atacante.cargarEnergia();

    const dialogoCarga = obtenerDialogo(personajeAtacante, 'energia');
    mostrarAccionDelPersonaje(personajeAtacante, 'energia', dialogoCarga, 1200);
    mostrarEfectoPoder(imagenAtacante, 800);

    actualizarEstadisticas(jugador1, jugador2);

    setTimeout(() => {
        terminarTurno(numeroJugador);
    }, 1200);
}

// Comprueba que pueda usar una semilla y recupera sus recursos.
function ejecutarCuracion(numeroJugador) {
    if (partidaTerminada || hayUnaAccionEnProgreso || turnoActual !== numeroJugador) {
        return;
    }

    const atacante = numeroJugador === 1 ? jugador1 : jugador2;
    const personajeAtacante = numeroJugador === 1 ? personajeJugador1 : personajeJugador2;
    const imagenAtacante = numeroJugador === 1 ? imagenJugador1 : imagenJugador2;

    const validacion = atacante.puedeUsarSemilla();
    if (!validacion.puede) {
        mostrarAlerta(validacion.razon, 'Semilla del Ermitaño');
        return;
    }

    hayUnaAccionEnProgreso = true;
    actualizarTurno(turnoActual, turnosJugador1, turnosJugador2, jugador1.getNombre(), jugador2.getNombre(), true);

    atacante.usarSemilla();

    const dialogoCurar = obtenerDialogo(personajeAtacante, 'curar');
    mostrarAccionDelPersonaje(personajeAtacante, 'curar', dialogoCurar, 1200);
    mostrarEfectoPoder(imagenAtacante, 800);

    actualizarEstadisticas(jugador1, jugador2);

    setTimeout(() => {
        terminarTurno(numeroJugador);
    }, 1200);
}

// Hace que los botones de ambos jugadores ejecuten su movimiento correspondiente.
export function configurarControlesCombate() {
    if (botonAtaqueBasicoJugador1) {
        botonAtaqueBasicoJugador1.addEventListener('click', () => ejecutarAtaqueBasico(1));
    }
    if (botonAtaqueEspecialJugador1) {
        botonAtaqueEspecialJugador1.addEventListener('click', () => ejecutarAtaqueEspecial(1));
    }
    if (botonCargarEnergiaJugador1) {
        botonCargarEnergiaJugador1.addEventListener('click', () => ejecutarCargaEnergia(1));
    }
    if (botonCuracionJugador1) {
        botonCuracionJugador1.addEventListener('click', () => ejecutarCuracion(1));
    }

    if (botonAtaqueBasicoJugador2) {
        botonAtaqueBasicoJugador2.addEventListener('click', () => ejecutarAtaqueBasico(2));
    }
    if (botonAtaqueEspecialJugador2) {
        botonAtaqueEspecialJugador2.addEventListener('click', () => ejecutarAtaqueEspecial(2));
    }
    if (botonCargarEnergiaJugador2) {
        botonCargarEnergiaJugador2.addEventListener('click', () => ejecutarCargaEnergia(2));
    }
    if (botonCuracionJugador2) {
        botonCuracionJugador2.addEventListener('click', () => ejecutarCuracion(2));
    }
}
