const fs = require('fs');
const path = require('path');
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType,
    ImageRun
} = require('docx');

async function buildDoc() {
    const imgDir = path.join(__dirname, 'docs', 'img');
    const p1Img = path.join(__dirname, 'dist', 'public', 'img', 'Goku', 'base.png');
    const p2Img = path.join(__dirname, 'dist', 'public', 'img', 'Veguetta', 'base.png');

    const scSeleccion = path.join(imgDir, 'seleccion_personajes.png');
    const scValidacion = path.join(imgDir, 'validacion_nombre.png');
    const scJ1Confirm = path.join(imgDir, 'jugador1_confirmado.png');

    const readImg = (filePath) => {
        try {
            if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath);
            }
        } catch (e) {
            console.error('Error reading image:', filePath, e);
        }
        return null;
    };

    const bufSeleccion = readImg(scSeleccion);
    const bufValidacion = readImg(scValidacion);
    const bufJ1Confirm = readImg(scJ1Confirm);
    const bufGoku = readImg(p1Img);
    const bufVegeta = readImg(p2Img);

    // Helpers for styled text
    const title = (text) => new Paragraph({
        text,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
    });

    const h1 = (text) => new Paragraph({
        text,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 150 }
    });

    const h2 = (text) => new Paragraph({
        text,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
    });

    const p = (text, options = {}) => new Paragraph({
        children: [new TextRun({ text, font: 'Calibri', size: 24, ...options })],
        spacing: { after: 120 }
    });

    const bullet = (text, boldPrefix = '') => new Paragraph({
        children: [
            boldPrefix ? new TextRun({ text: boldPrefix + ' ', bold: true, font: 'Calibri', size: 24 }) : new TextRun({ text: '', font: 'Calibri' }),
            new TextRun({ text, font: 'Calibri', size: 24 })
        ],
        bullet: { level: 0 },
        spacing: { after: 80 }
    });

    const codeSnippet = (text) => new Paragraph({
        children: [new TextRun({ text, font: 'Consolas', size: 20, color: '1A365D' })],
        spacing: { before: 60, after: 60 },
        indent: { left: 400 }
    });

    // Create table helper
    const createChecklistTable = () => {
        const headers = ['Requisito', 'Evidencia Esperada', 'Resultado', 'Detalle Técnico'];
        const rowsData = [
            [
                'Selección de personajes',
                'Permite seleccionar personajes de ambos jugadores y evita selecciones inválidas o repetidas.',
                'SÍ (100%)',
                'src/index.js: Función seleccionarPersonaje valida que Jugador 2 no escoja el personaje confirmado por Jugador 1 y deshabilita su miniatura visualmente.'
            ],
            [
                'Nombre de usuario',
                'No permite campo vacío; solo letras y números. Rechaza espacios y símbolos.',
                'SÍ (100%)',
                'src/index.js: Evento input ejecuta regex /[^a-zA-Z0-9]/g para sanitización inmediata y función validarNombre rechaza cadenas vacías o con símbolos.'
            ],
            [
                'Inicio de partida',
                'Al comenzar el combate, el Jugador 1 tiene el primer turno.',
                'SÍ (100%)',
                'src/Combate.js: Variable turnoActual = 1 se inicializa; banner superior y panel visual destacan al Jugador 1 y habilitan únicamente sus controles.'
            ],
            [
                'Un movimiento por turno',
                'Cada jugador solo puede ejecutar una acción por turno; después cambia el turno.',
                'SÍ (100%)',
                'src/Combate.js: Variable hayUnaAccionEnProgreso bloquea todos los botones durante la ejecución de la técnica y al finalizar llama a terminarTurno().'
            ],
            [
                'Uso de Semillas del ermitaño',
                'Solo se permite si al menos una de las barras (energía, ki o vida) está por debajo de 100%.',
                'SÍ (100%)',
                'src/Acciones.js: Método puedeUsarSemilla comprueba vida < 100 || ki < 100 || energia < 100; de lo contrario despliega alerta SweetAlert2 y no gasta turno.'
            ],
            [
                'Límite de semillas',
                'Cada jugador dispone de un máximo de 2 semillas durante todo el combate.',
                'SÍ (100%)',
                'src/Personaje.js: Atributo semilla = 2. Setter valida Math.max(0, Math.min(2, semilla)). Al llegar a 0 se bloquea el uso.'
            ],
            [
                'Límites de barras',
                'Las barras de vida, ki y energía nunca superan el 100% ni bajan de 0%.',
                'SÍ (100%)',
                'src/Personaje.js: Métodos setVida, setKi y setEnergia aplican Math.max(0, Math.min(100, valor)) en cada alteración.'
            ],
            [
                'Ataque especial',
                'Se habilita únicamente después del segundo turno completado de cada jugador.',
                'SÍ (100%)',
                'src/Combate.js: Conteo individual de turnos (turnosJugador1 y turnosJugador2). Solo cuando turnos >= 2 se habilita el botón y cambia a estado ¡LISTO!.'
            ],
            [
                'Fin del combate',
                'Cuando la vida de cualquier jugador llega a 0, se bloquean nuevas acciones y termina.',
                'SÍ (100%)',
                'src/Combate.js: Función revisarSiTerminoElCombate() evalúa vida <= 0, activa partidaTerminada = true y bloquea todos los controles permanentemente.'
            ],
            [
                'Pantalla de carga',
                'Al iniciar el combate se muestra pantalla o indicador de carga antes de presentar la batalla.',
                'SÍ (100%)',
                'src/index.js: Sección #loading-stage muestra cuenta regresiva con animación de pulso (3, 2, 1) antes de invocar la pantalla de combate.'
            ],
            [
                'Animación y diálogo',
                'Cada personaje muestra su animación y un diálogo asociado durante acciones o eventos.',
                'SÍ (100%)',
                'src/Dialogos.js y src/interfaz.js: Modales temáticos SweetAlert2 con sprites de combate para cada guerrero, diálogos únicos y efectos de impacto/poder.'
            ],
            [
                'Resultado y reinicio',
                'Al terminar, una alerta identifica al ganador y, al confirmarse, vuelve al menú de selección.',
                'SÍ (100%)',
                'src/interfaz.js y src/index.js: Función mostrarVictoria() despliega al campeón y botón de regreso ejecuta regresarASeleccion() restaurando campos y estado.'
            ]
        ];

        const headerRow = new TableRow({
            tableHeader: true,
            children: headers.map(h => new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', font: 'Calibri', size: 22 })],
                    alignment: AlignmentType.CENTER
                })],
                shading: { fill: 'D9381E' } // DBZ Orange/Red
            }))
        });

        const dataRows = rowsData.map((row, idx) => new TableRow({
            children: row.map((cellText, cellIdx) => new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: cellText,
                        bold: cellIdx === 2,
                        color: cellIdx === 2 ? '008000' : '000000',
                        font: 'Calibri',
                        size: 20
                    })],
                    alignment: cellIdx === 2 ? AlignmentType.CENTER : AlignmentType.LEFT
                })],
                shading: { fill: idx % 2 === 0 ? 'F9FAFB' : 'FFFFFF' }
            }))
        }));

        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...dataRows]
        });
    };

    const docChildren = [
        // PORTADA
        new Paragraph({
            text: 'TECNOLÓGICO NACIONAL DE MÉXICO',
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'TECNOLÓGICO NACIONAL DE MÉXICO', bold: true, size: 28, font: 'Calibri', color: '1A365D' })],
            spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'INSTITUTO TECNOLÓGICO DE MILPA ALTA II', bold: true, size: 24, font: 'Calibri', color: '4A5568' })],
            spacing: { after: 300 }
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'DEPARTAMENTO DE INGENIERÍA EN SISTEMAS COMPUTACIONALES', size: 22, font: 'Calibri' })],
            spacing: { after: 600 }
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'DRAGON BALL GAME: TORNEO POR TURNOS', bold: true, size: 36, font: 'Calibri', color: 'D9381E' })],
            spacing: { after: 200 }
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'DOCUMENTACIÓN TÉCNICA Y REPORTE DE CUMPLIMIENTO FUNCIONAL', italics: true, size: 24, font: 'Calibri', color: '718096' })],
            spacing: { after: 800 }
        }),

        // Metadatos de la materia y alumno
        new Paragraph({
            children: [
                new TextRun({ text: 'Materia: ', bold: true, font: 'Calibri', size: 24 }),
                new TextRun({ text: 'Aplicaciones Web Front End', font: 'Calibri', size: 24 })
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Docente: ', bold: true, font: 'Calibri', size: 24 }),
                new TextRun({ text: 'Ing. Diego Alberto Bollas Paredes', font: 'Calibri', size: 24 })
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Grupo: ', bold: true, font: 'Calibri', size: 24 }),
                new TextRun({ text: '7 SIS', font: 'Calibri', size: 24 })
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Fecha: ', bold: true, font: 'Calibri', size: 24 }),
                new TextRun({ text: 'Octubre 2026', font: 'Calibri', size: 24 })
            ],
            spacing: { after: 600 }
        }),

        // SECCIÓN 1: INTRODUCCIÓN Y OBJETIVOS
        h1('1. Introducción y Objetivos'),
        p('El presente proyecto consiste en el desarrollo integral de una aplicación web interactiva inspirada en el anime Dragon Ball, la cual implementa un simulador táctico de combate por turnos entre dos jugadores locales. El sistema fue diseñado bajo estrictos estándares de ingeniería de software front-end, aplicando programación orientada a objetos en JavaScript moderno (ECMAScript 6+), empaquetado modular mediante Webpack 5 y transpilación con Babel.'),
        p('Los objetivos centrales alcanzados incluyen:'),
        bullet('Desarrollo de lógica modular y reactiva con separación clara entre estado, combate, diálogos e interfaz.', '• Modularidad y Clean Code:'),
        bullet('Control riguroso de entradas alfanuméricas, evitando cadenas vacías, símbolos y espacios.', '• Robustez en Validaciones:'),
        bullet('Alternancia de turnos, límites matemáticos estrictos en barras de vida, energía y ki (0 a 100), conteo de semillas y desbloqueo progresivo del Ataque Especial.', '• Fidelidad en Reglas de Combate:'),
        bullet('Uso inteligente de Bootstrap 5, variables CSS personalizadas, animaciones de anime y alertas interactivas con SweetAlert2.', '• Experiencia Visual de Alto Impacto:'),

        // SECCIÓN 2: ARQUITECTURA DEL PROYECTO
        h1('2. Estructura y Árbol del Proyecto'),
        p('El proyecto mantiene una estructura modular y organizada donde cada componente tiene una sola responsabilidad (principio de responsabilidad única):'),
        codeSnippet('proyecto1/\n├── .babelrc                 # Configuración de transpilación Babel (@babel/preset-env)\n├── .gitignore               # Exclusión de dependencias node_modules\n├── package.json             # Manifiesto de dependencias y scripts de construcción\n├── webpack.config.js        # Configuración de Webpack para JS, SCSS/CSS y assets\n├── serve.js                 # Servidor local Node.js para pruebas y previsualización\n├── dist/                    # Directorio de distribución y producción (GitHub Pages)\n│   ├── index.html           # Estructura semántica HTML5 y contenedores interactivos\n│   ├── bundle.js            # Código JavaScript optimizado y compilado por Webpack\n│   └── public/img/          # Recursos gráficos: Sprites, selecciones y fondos\n│       ├── Goku/            # Animaciones y sprites de Goku\n│       ├── Veguetta/        # Animaciones y sprites de Vegeta\n│       ├── Gohan/           # Sprites de Gohan\n│       ├── Pikoro/          # Sprites de Piccolo\n│       ├── Trunks/          # Sprites de Trunks\n│       ├── Cell/            # Sprites de Cell\n│       ├── Vegitto/         # Sprites de Vegito\n│       ├── Gogeta/          # Sprites de Gogeta\n│       └── seleccion/       # Retratos circulares de selección de guerreros\n└── src/                     # Código fuente modular en ECMAScript 6+\n    ├── Personaje.js         # Clase base con atributos y límites (HP, Ki, Energía, Semillas)\n    ├── Acciones.js          # Clase extendida con lógica de habilidades y consumibles\n    ├── Combate.js           # Orquestador del flujo de turnos y fin de batalla\n    ├── Dialogos.js          # Catálogo temático de frases y diálogos por guerrero\n    ├── interfaz.js          # Manipulación DOM, efectos de impacto y modales SweetAlert2\n    ├── index.js             # Punto de entrada, validación de inputs y selección\n    └── style.css            # Estilos CSS premium (Glassmorphism, fuentes Orbitron/Rajdhani)'),

        // SECCIÓN 3: MATRIZ DE EVALUACIÓN Y LISTA DE VERIFICACIÓN FUNCIONAL
        h1('3. Lista de Verificación Funcional (Rúbrica de Evaluación)'),
        p('A continuación se presenta la matriz detallada de cumplimiento de los 12 requisitos funcionales exigidos en la rúbrica institucional (35 puntos técnicos directos y 65 puntos de arquitectura, modularidad, diseño y código ES):'),
        createChecklistTable(),

        // SECCIÓN 4: DETALLE DE IMPLEMENTACIÓN POR MÓDULOS
        h1('4. Detalle Técnico de Implementación'),
        h2('4.1 Validación de Nombre y Selección de Personajes (src/index.js)'),
        p('El nombre de usuario se valida en tiempo real. Se vinculó el evento input para reemplazar cualquier carácter no alfanumérico al instante:'),
        codeSnippet('function limpiarNombre(evento) {\n    evento.target.value = evento.target.value.replace(/[^a-zA-Z0-9]/g, "");\n}\nfunction validarNombre(nombre, jugador) {\n    if (nombre === "") {\n        mostrarAlerta(`El ${jugador} debe ingresar un nombre.`);\n        return false;\n    }\n    if (!/^[a-zA-Z0-9]+$/.test(nombre)) {\n        mostrarAlerta(`El nombre del ${jugador} solo puede tener letras y números.`);\n        return false;\n    }\n    return true;\n}'),
        p('Para evitar selecciones inválidas o duplicadas, el Jugador 2 no puede seleccionar a ningún guerrero antes de que el Jugador 1 haya confirmado, y el personaje confirmado por el Jugador 1 queda inmediatamente bloqueado y en escala de grises para el Jugador 2.'),

        h2('4.2 Encapsulamiento y Control de Recursos (src/Personaje.js y src/Acciones.js)'),
        p('Las barras de estado nunca superan el 100% ni caen por debajo de 0% gracias al uso de funciones matemáticas de acotamiento en los métodos mutadores (setters):'),
        codeSnippet('setVida(vida) {\n    this.vida = Math.max(0, Math.min(100, Math.round(Number(vida) || 0)));\n}\nsetKi(ki) {\n    this.ki = Math.max(0, Math.min(100, Math.round(Number(ki) || 0)));\n}\nsetEnergia(energia) {\n    this.energia = Math.max(0, Math.min(100, Math.round(Number(energia) || 0)));\n}'),
        p('Asimismo, la condición estricta de la Semilla del Ermitaño verifica si existe algún recurso degradado:'),
        codeSnippet('puedeUsarSemilla() {\n    if (this.getSemilla() <= 0) {\n        return { puede: false, razon: `${this.getNombre()} ya no tiene semillas del ermitaño.` };\n    }\n    const tieneAlgoPorRecuperar = this.getVida() < 100 || this.getKi() < 100 || this.getEnergia() < 100;\n    if (!tieneAlgoPorRecuperar) {\n        return {\n            puede: false,\n            razon: `${this.getNombre()} tiene toda su vida, Ki y energía al 100%. Solo puede usarla si algo está por debajo del 100%.`\n        };\n    }\n    return { puede: true, razon: "" };\n}'),

        h2('4.3 Conteo de Turnos y Ataque Especial (src/Combate.js)'),
        p('El Ataque Especial permanece bloqueado con un distintivo "0/2" o "1/2" durante los dos primeros turnos de cada contendiente. Solo a partir del tercer turno (después de 2 turnos completados), el botón se desbloquea dinámicamente mostrando el estado "¡LISTO!". Además, cada turno solo permite una acción: durante la ejecución técnica, todos los botones se deshabilitan evitando dobles movimientos.'),

        // SECCIÓN 5: EVIDENCIAS FOTOGRÁFICAS
        h1('5. Evidencias de Ejecución y Pruebas'),
        p('A continuación se documentan las capturas de pantalla de la aplicación en funcionamiento:')
    ];

    // Add screenshots if available
    if (bufSeleccion) {
        docChildren.push(h2('Captura 1: Interfaz Principal y Selección de Personajes'));
        docChildren.push(new Paragraph({
            children: [
                new ImageRun({
                    data: bufSeleccion,
                    transformation: { width: 550, height: 260 }
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 150 }
        }));
        docChildren.push(p('Figura 1. Pantalla de selección con diseño Dragon Ball Glassmorphism, campos de texto y retratos de guerreros.', { italics: true }));
    }

    if (bufValidacion) {
        docChildren.push(h2('Captura 2: Validación de Entrada Alfanumérica'));
        docChildren.push(new Paragraph({
            children: [
                new ImageRun({
                    data: bufValidacion,
                    transformation: { width: 550, height: 260 }
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 150 }
        }));
        docChildren.push(p('Figura 2. Sanitización en tiempo real: los caracteres especiales y espacios son filtrados automáticamente.', { italics: true }));
    }

    if (bufJ1Confirm) {
        docChildren.push(h2('Captura 3: Confirmación de Jugador 1 y Bloqueo de Guerrero para Jugador 2'));
        docChildren.push(new Paragraph({
            children: [
                new ImageRun({
                    data: bufJ1Confirm,
                    transformation: { width: 550, height: 260 }
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 150 }
        }));
        docChildren.push(p('Figura 3. El Jugador 1 queda confirmado con Goku y dicho personaje se deshabilita para evitar selecciones duplicadas.', { italics: true }));
    }

    // SECCIÓN 6: GUÍA DE DESPLIEGUE EN GITHUB Y GITHUB PAGES
    docChildren.push(
        h1('6. Guía de Ejecución y Despliegue en GitHub & GitHub Pages'),
        h2('6.1 Ejecución Local'),
        p('Para ejecutar el proyecto en un entorno local:'),
        bullet('Instalación de módulos: npm install', '1.'),
        bullet('Compilación con Webpack: npm run build', '2.'),
        bullet('Servidor local de desarrollo: npm run dev  (o alternativamente: node serve.js)', '3.'),
        bullet('Abrir en el navegador: http://localhost:8080/ o http://localhost:3000/', '4.'),

        h2('6.2 Repositorio Git y Despliegue en GitHub Pages'),
        p('El proyecto cuenta con dos ramas preparadas para despliegue instantáneo:'),
        bullet('Rama main: Contiene el código fuente completo, configuración de Webpack/Babel y el flujo automatizado de GitHub Actions (.github/workflows/deploy.yml).', '• Rama principal:'),
        bullet('Rama gh-pages: Creada con git subtree conteniendo el directorio dist compilado directamente en la raíz para publicación nativa en GitHub Pages.', '• Rama de despliegue:'),
        p('Para subir los cambios a un repositorio remoto de GitHub personal:'),
        codeSnippet('git remote add origin https://github.com/TU_USUARIO/dragon-ball-game.git\ngit push -u origin main\ngit push origin gh-pages'),
        p('En los Ajustes de GitHub (Settings > Pages), seleccione la fuente "Deploy from a branch" y elija la rama "gh-pages" (o "GitHub Actions"), lo que pondrá el juego disponible en:'),
        codeSnippet('https://TU_USUARIO.github.io/dragon-ball-game/')
    );

    // SECCIÓN 7: CONCLUSIÓN
    docChildren.push(
        h1('7. Conclusión'),
        p('El desarrollo de Dragon Ball Game demostró la correcta aplicación de conceptos avanzados de desarrollo web front-end: arquitectura orientada a objetos en ECMAScript moderno, modularidad estricta con Webpack y Babel, validaciones a prueba de errores, diseño visual altamente inmersivo con Bootstrap 5 y SweetAlert2, y cumplimiento al 100% de la rúbrica de evaluación institucional.')
    );

    const doc = new Document({
        sections: [{
            properties: {},
            children: docChildren
        }]
    });

    const outputPath = path.join(__dirname, 'Dragon_Ball_Game_Documentacion.docx');
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
    console.log(`Documento Word generado exitosamente en: ${outputPath}`);
}

buildDoc().catch(err => {
    console.error('Error generando documento Word:', err);
    process.exit(1);
});
