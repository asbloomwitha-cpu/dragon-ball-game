// Guarda las frases que dicen los personajes al empezar o hacer un movimiento.
const dialogosPersonajes = {
    Goku: {
        inicio: '¡Hola, soy Goku! ¡Estoy muy emocionado por esta gran batalla!',
        basico: '¡Toma esto! ¡Haaah!',
        especial: '¡¡KAME HAME HAAAA!! ¡Con todo mi poder!',
        energia: '¡Aumentando mi Ki al máximo nivel! ¡Aaaaah!',
        curar: '¡Gracias maestro Karin! ¡Deliciosa Semilla del Ermitaño!',
        golpe: '¡Ghh... qué buen golpe tienes!',
        victoria: '¡Fue un combate increíble! ¡Entrenemos de nuevo pronto!',
        derrota: 'Jeje... realmente eres un oponente formidable...'
    },
    Veguetta: {
        inicio: '¡Prepárate insecto! ¡Presenciarás el verdadero poder del Príncipe Saiyajin!',
        basico: '¡Muere, miserable sabandija!',
        especial: '¡¡FINAL FLASH!! ¡¡RESPLANDOR FINAL SAIYAJIN!!',
        energia: '¡Haaaah! ¡Mi poder de combate sobrepasa cualquier límite!',
        curar: '¡Maldita sea... tendré que usar esta Semilla del Ermitaño!',
        golpe: '¡Maldito... pagarás muy caro este atrevimiento!',
        victoria: '¡Nadie en el universo puede superar al Príncipe de los Saiyajin!',
        derrota: '¡Imposible... un guerrero de clase baja no puede derrotarme...!'
    },
    Gohan: {
        inicio: '¡No permitiré que destruyas la paz ni lastimes a nadie más!',
        basico: '¡Aquí voy! ¡Masenko!',
        especial: '¡¡KAME HAME HA CON TODO MI PODER!! ¡Despierta mi furia!',
        energia: '¡Liberaré todo el poder oculto dentro de mí!',
        curar: '¡Una Semilla del Ermitaño! ¡He recuperado todas mis fuerzas!',
        golpe: '¡Aaargh! ¡No me rendiré!',
        victoria: '¡Lo logré! ¡Pude proteger a todos!',
        derrota: 'Perdónenme... no fui lo suficientemente fuerte...'
    },
    Pikoro: {
        inicio: 'No te confíes por mi silencio... la fuerza bruta no lo es todo.',
        basico: '¡Eres demasiado lento para mis reflejos!',
        especial: '¡¡MAKANKOSAPPO!! ¡Atraviesa y destruye!',
        energia: '¡Concentrando mi energía mística namekiana!',
        curar: '¡Una Semilla del Ermitaño! Mi regeneración se activa.',
        golpe: '¡Hmph, apenas si sentí ese golpe!',
        victoria: 'Tu técnica estuvo llena de aberturas desde el inicio.',
        derrota: 'Maldición... mi fuerza no fue suficiente...'
    },
    Trunks: {
        inicio: '¡Vengo del futuro para asegurar que la esperanza no muera!',
        basico: '¡Corte de espada a velocidad supersónica!',
        especial: '¡¡BURNING ATTACK!! ¡Ataque Ardiente del Futuro!',
        energia: '¡Lucharé con toda la determinación del futuro!',
        curar: '¡Las Semillas del Ermitaño del pasado son milagrosas!',
        golpe: '¡Ugh... es más rápido de lo que calculé!',
        victoria: '¡La paz en esta línea temporal está a salvo!',
        derrota: 'Lo siento, madre... señor Piccolo... fracasé...'
    },
    Cell: {
        inicio: 'Contempla al guerrero perfecto. Tu trágico final ya está escrito.',
        basico: '¡Patético y débil intento de golpe!',
        especial: '¡¡KAME HAME HA SOLAR!! ¡Vuela en pedazos junto con la Tierra!',
        energia: '¡Mi perfección celular se expande exponencialmente!',
        curar: '¡Absorbiendo la vitalidad de la Semilla del Ermitaño!',
        golpe: '¡¿Cómo te atreves a tocar a la criatura perfecta?!',
        victoria: '¡La perfección absoluta ha triunfado sin esfuerzo!',
        derrota: '¡¡NOOOO PUEDE SER!! ¡¡SOY EL GUERRERO PERFECTOOO!!'
    },
    Vegitto: {
        inicio: '¡Estoy listo! ¡Veamos si puedes hacerme usar mis manos!',
        basico: '¡¿Eso es todo lo que tienes?! ¡Qué decepción!',
        especial: '¡¡ESPADA DE ESPÍRITU FINAL!! ¡¡TOMA ESTO!!',
        energia: '¡Jaja! ¡Apenas estoy comenzando a calentar motores!',
        curar: '¡Semilla del Ermitaño! Como nuevo para seguir divirtiéndome.',
        golpe: 'Je, nada mal... tienes agallas.',
        victoria: '¡Esperaba mucho más de ti! ¡Victoria indiscutible!',
        derrota: 'Vaya sorpresa... parece que me confié demasiado...'
    },
    Gogeta: {
        inicio: '¡No soy ni Goku ni Vegeta! ¡Soy quien te enviará al otro mundo!',
        basico: '¡Ráfaga de impactos divinos!',
        especial: '¡¡ROMPEPOLVO ESTELAR!! ¡Purificación absoluta del alma!',
        energia: '¡El poder de la fusión cósmica resuena en todo el universo!',
        curar: '¡Semilla consumida! ¡Poder restaurado al cien por ciento!',
        golpe: '¡Un impacto respetable!',
        victoria: 'Cada segundo de este combate estuvo bajo mi absoluto control.',
        derrota: 'El tiempo límite de la fusión... se ha agotado...'
    }
};

// Busca la frase que corresponde al personaje y movimiento, o devuelve una frase general.
export function obtenerDialogo(personaje, tipoAccion) {
    const dialogo = dialogosPersonajes[personaje];
    if (dialogo && dialogo[tipoAccion]) {
        return dialogo[tipoAccion];
    }

    return `¡Poder Saiyajin en acción!`;
}
