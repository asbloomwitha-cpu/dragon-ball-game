class Personaje {
    // Crea un jugador con sus recursos completos y dos semillas.
    constructor(nombre) {
        this.nombre = nombre;
        this.vida = 100;
        this.ki = 100;
        this.energia = 100;
        this.semilla = 2;
    }

    // Devuelve el nombre que escribió el jugador.
    getNombre() {
        return this.nombre;
    }

    // Devuelve la vida actual del jugador.
    getVida() {
        return this.vida;
    }

    // Devuelve el Ki actual del jugador.
    getKi() {
        return this.ki;
    }

    // Devuelve la energía actual del jugador.
    getEnergia() {
        return this.energia;
    }

    // Devuelve cuántas semillas le quedan.
    getSemilla() {
        return this.semilla;
    }

    // Cambia la vida y no permite que sea menor que 0 ni mayor que 100.
    setVida(vida) {
        this.vida = Math.max(0, Math.min(100, Math.round(Number(vida) || 0)));
    }

    // Cambia el Ki y lo mantiene entre 0 y 100.
    setKi(ki) {
        this.ki = Math.max(0, Math.min(100, Math.round(Number(ki) || 0)));
    }

    // Cambia la energía y la mantiene entre 0 y 100.
    setEnergia(energia) {
        this.energia = Math.max(0, Math.min(100, Math.round(Number(energia) || 0)));
    }

    // Cambia las semillas y permite tener entre 0 y 2.
    setSemilla(semilla) {
        this.semilla = Math.max(0, Math.min(2, Math.round(Number(semilla) || 0)));
    }

    // Resta de la vida el daño causado por el ataque de otro jugador.
    recibirDanio(danio) {
        this.setVida(this.vida - Math.max(0, Number(danio) || 0));
    }
}

// Permite que otras partes del juego usen esta clase.
export default Personaje;
