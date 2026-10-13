import Personaje from './Personaje.js';

// Esta clase agrega los movimientos de combate a los datos básicos del personaje.
class Acciones extends Personaje {
    // Comprueba antes del ataque básico que el jugador tenga suficiente energía y Ki.
    // Combate.js usa el resultado para mostrar un aviso si no puede atacar.
    puedeHacerAtaqueBasico() {
        if (this.getEnergia() < 5 || this.getKi() < 10) {
            return {
                puede: false,
                razon: `${this.getNombre()} no tiene suficiente Ki o Energía. El ataque básico necesita 10 de Ki y 5 de energía.`
            };
        }

        return { puede: true, razon: '' };
    }

    // Hace el ataque básico: gasta 5 de energía y 10 de Ki, y quita 15 de vida al rival.
    // Devuelve false si el jugador no tiene recursos suficientes.
    hacerAtaqueBasico(oponente) {
        const resultado = this.puedeHacerAtaqueBasico();
        if (!resultado.puede) {
            return false;
        }

        this.setEnergia(this.getEnergia() - 5);
        this.setKi(this.getKi() - 10);

        if (oponente && typeof oponente.recibirDanio === 'function') {
            oponente.recibirDanio(15);
        }

        return true;
    }

    // Comprueba que el jugador tenga los recursos necesarios para el ataque especial.
    puedeHacerAtaqueEspecial() {
        if (this.getEnergia() < 15 || this.getKi() < 20) {
            return {
                puede: false,
                razon: `${this.getNombre()} no tiene suficiente Ki o energía. El ataque especial necesita 20 de Ki y 15 de energía.`
            };
        }

        return { puede: true, razon: '' };
    }

    // Hace el ataque especial: gasta 15 de energía y 20 de Ki, y quita 35 de vida al rival.
    // La espera de dos turnos antes de usarlo se controla en Combate.js.
    hacerAtaqueEspecial(oponente) {
        const resultado = this.puedeHacerAtaqueEspecial();
        if (!resultado.puede) {
            return false;
        }

        this.setEnergia(this.getEnergia() - 15);
        this.setKi(this.getKi() - 20);

        if (oponente && typeof oponente.recibirDanio === 'function') {
            oponente.recibirDanio(35);
        }

        return true;
    }

    // Revisa que quede una semilla y que la vida, el Ki o la energía no estén al máximo.
    // Así el jugador no puede gastar una semilla sin necesitarla.
    puedeUsarSemilla() {
        if (this.getSemilla() <= 0) {
            return {
                puede: false,
                razon: `${this.getNombre()} ya no tiene semillas del ermitaño.`
            };
        }

        const tieneAlgoPorRecuperar =
            this.getVida() < 100 || this.getKi() < 100 || this.getEnergia() < 100;

        if (!tieneAlgoPorRecuperar) {
            return {
                puede: false,
                razon: `${this.getNombre()} tiene toda su vida, Ki y energía. Solo puede usar una semilla si algo está por debajo del 100%.`
            };
        }

        return { puede: true, razon: '' };
    }

    // Usa una semilla: restaura la vida, el Ki y la energía, y descuenta una del inventario.
    // Devuelve false si no se cumplen las condiciones para usarla.
    usarSemilla() {
        const resultado = this.puedeUsarSemilla();
        if (!resultado.puede) {
            return false;
        }

        this.setVida(100);
        this.setKi(100);
        this.setEnergia(100);
        this.setSemilla(this.getSemilla() - 1);

        return true;
    }

    // Permite al jugador recuperar 15 de energía y 10 de Ki durante su turno.
    // Los métodos de Personaje evitan que esos valores pasen de 100.
    cargarEnergia() {
        this.setEnergia(this.getEnergia() + 15);
        this.setKi(this.getKi() + 10);
    }
}

// Permite usar esta clase desde otros archivos.
export default Acciones;
