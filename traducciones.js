let currentLanguage = 'es';

const translations = {
    'es': {
        'flag' : './img/spanish.png',
        'labelNumJugadores': 'Numero de jugadores',
        'labelActivarAudio': '¿Activar audio?',
        'labelDificultad': 'Nivel de dificultad (1-10):',
        'labelNombreJugador': 'Nombre Jugador ',
        'labelTeclaArriba': 'Tecla Arriba Jugador ',
        'labelTeclaAbajo': 'Tecla Abajo Jugador ',
        'labelUsarRueda': 'Usar Rueda Raton en Jugador ',
        'labelUsarFlechas': 'Usar Flechas Arriba/Abajo en Jugador ',
        'buttonCargar': 'Cargar',
        'buttonEmpezarPartida': 'Empezar partida',
        'labelLimitePuntos': 'Limite de puntuacion:',
    },
    'en': {
        'flag' : './img/english.jpg',
        'labelNumJugadores': 'Number of players',
        'labelActivarAudio': 'Enable audio?',
        'labelDificultad': 'Difficulty level (1-10):',
        'labelNombreJugador': 'Player Name ',
        'labelTeclaArriba': 'Player Up Key ',
        'labelTeclaAbajo': 'Player Down Key ',
        'labelUsarRueda': 'Use Mouse Wheel for Player ',
        'labelUsarFlechas': 'Use Arrow Keys for Player ',
        'buttonCargar': 'Load',
        'buttonEmpezarPartida': 'Start Game',
        'labelLimitePuntos': 'Score Limit:',
    },
};

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    document.getElementById("imgflag").src = translations[currentLanguage]['flag'];
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        let concatenar = (!isNaN(parseInt(element.innerHTML.charAt(element.innerHTML.length-1))) ? element.innerHTML.charAt(element.innerHTML.length-1) : "");
        element.innerText = translations[currentLanguage][key] + concatenar || key;
    });
}

function changeLanguage() {
    currentLanguage = (currentLanguage === 'es') ? 'en' : 'es';
    applyTranslations();
}

// Inicializar las traducciones cuando la página se carga
document.addEventListener('DOMContentLoaded', applyTranslations);
