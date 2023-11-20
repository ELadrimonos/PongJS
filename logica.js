// TODO comentar cosas

const cargarConfigJugadores = () => {
    let numJugadores = parseInt(document.getElementById("numJugadores").value);
    if (numJugadores > 2 || numJugadores < 0) throw new Error("Número de jugadores incorrecto.");
    let configuracion = document.getElementById("configPartida");
    let confJug = document.getElementById("ajustesJugadores");
    confJug.innerHTML = "";
    document.getElementById("menu").style.display = "none";
    configuracion.style.display = "flex";
    for (let i = 1; i <= numJugadores; i++) {
        let contenedor = document.createElement("div");
        let label = document.createElement("label");
        label.htmlFor = "nombre" + i;
        label.innerText = translations[currentLanguage]['labelNombreJugador'] + i;
        label.dataset.i18n = "labelNombreJugador";
        let nombreJugador = document.createElement("input");
        nombreJugador.type = "text";
        nombreJugador.id = "nombre" + i;
        contenedor.appendChild(label);
        contenedor.appendChild(nombreJugador);

        let labelArriba = document.createElement("label");
        labelArriba.htmlFor = "teclaArriba" + i;
        labelArriba.innerText = translations[currentLanguage]['labelTeclaArriba'] + i;
        labelArriba.dataset.i18n = "labelTeclaArriba";
        let botonTeclaArriba = document.createElement("input");
        botonTeclaArriba.type = "text";
        botonTeclaArriba.id = "teclaArriba" + i;
        botonTeclaArriba.required = true;
        botonTeclaArriba.maxLength = 1;

        contenedor.appendChild(labelArriba);
        contenedor.appendChild(botonTeclaArriba);

        let labelAbajo = document.createElement("label");
        labelAbajo.htmlFor = "teclaAbajo" + i;
        labelAbajo.innerText = translations[currentLanguage]['labelTeclaAbajo'] + i;
        labelAbajo.dataset.i18n = "labelTeclaAbajo";
        let botonTeclaAbajo = document.createElement("input");
        botonTeclaAbajo.id = "teclaAbajo" + i;
        botonTeclaAbajo.maxLength = 1;
        botonTeclaAbajo.required = true;
        contenedor.appendChild(labelAbajo);
        contenedor.appendChild(botonTeclaAbajo);

        let labelRueda =    document.createElement("label");
        labelRueda.htmlFor = "rueda" + i;
        labelRueda.innerText = translations[currentLanguage]['labelUsarRueda'] + i;
        labelRueda.dataset.i18n = "labelUsarRueda";
        let opcionRaton = document.createElement("input");
        opcionRaton.id = "rueda" + i;
        opcionRaton.type = "checkbox";


        let labelFlechas =    document.createElement("label");
        labelFlechas.htmlFor = "flecha" + i;
        labelFlechas.innerText = translations[currentLanguage]['labelUsarFlechas'] + i;
        labelFlechas.dataset.i18n = "labelUsarFlechas";
        let opcionFlechas = document.createElement("input");
        opcionFlechas.id = "flecha" + i;
        opcionFlechas.type = "checkbox";

        let otroJugador = (i === 1 ? 2 : 1);

        opcionFlechas.onchange = () => {
            togglearControles()

            if (!(numJugadores === 2 && opcionRaton.disabled && document.getElementById("rueda"+otroJugador).checked)) {
                opcionRaton.disabled = !opcionRaton.disabled;
                try {
                    document.getElementById("flecha"+otroJugador).disabled = !document.getElementById("flecha"+otroJugador).disabled ;
                } catch (e) {
                    console.warn("Que no van las flechas")
                }
            }
        }

        opcionRaton.onchange = () => {
            togglearControles()

            if (!(numJugadores === 2 && opcionFlechas.disabled && document.getElementById("flecha"+otroJugador).checked)) {
                opcionFlechas.disabled = !opcionFlechas.disabled;
                try {
                    document.getElementById("rueda"+otroJugador).disabled = !document.getElementById("rueda"+otroJugador).disabled ;
                } catch (e) {
                    console.warn("Que no va la rueda")
                }
            }
        }

        function togglearControles() {
            botonTeclaAbajo.disabled = !botonTeclaAbajo.disabled;
            botonTeclaAbajo.required = !botonTeclaAbajo.required;
            botonTeclaAbajo.value = "";
            botonTeclaArriba.disabled = !botonTeclaArriba.disabled;
            botonTeclaArriba.required = !botonTeclaArriba.required;
            botonTeclaArriba.value = "";
        }

        contenedor.appendChild(labelRueda);
        contenedor.appendChild(opcionRaton);
        contenedor.appendChild(labelFlechas);
        contenedor.appendChild(opcionFlechas);


        confJug.appendChild(contenedor);

        if (document.getElementById("limitePuntos") !== null){
            document.getElementById("limitePuntos").remove();
            document.getElementById("labelLimite").remove();
        }

        if (i === 2){
            let contenedorGuay = document.createElement("div");
            let labelLimitePuntos = document.createElement("label");
            labelLimitePuntos.htmlFor = "limitePuntos";
            labelLimitePuntos.innerText = translations[currentLanguage]['labelLimitePuntos'];
            labelLimitePuntos.dataset.i18n = "labelLimitePuntos";
            labelLimitePuntos.id = "labelLimite";
            let inputLimite = document.createElement("input");
            inputLimite.id = "limitePuntos";
            inputLimite.type = "number";
            inputLimite.min = "3";
            inputLimite.value = "3";
            contenedorGuay.appendChild(labelLimitePuntos);
            contenedorGuay.appendChild(inputLimite);
            document.getElementById("form").appendChild(contenedorGuay);
        }
    }
}

let puntuaciones = [0,0];
let nombres = [];

let pelota;
let rastro;
let paleta1;
let paleta2;

let campoPartida;

const radioPelota = 25;

let ball_movement;
let rebotes;

let velocidadX = 5;
let velocidadY = 5;
let velocidadBasePaleta = 10;
let velocidadPelotaMaxima = 20;

let teclaArribaJ1;
let teclaArribaJ2;
let teclaAbajoJ1;
let teclaAbajoJ2;

let teclaPausa = "Escape";

let dificultad;

let limitePuntos;


let noSeHaChocado = true;
let pausado = false;

let jugadorRaton = 0;

let jugadores;
let estadoPartida = [false, false];

let keyState = {};

let sonidoPared = new Audio("./sfx/hitPared.wav");
let sonidoJugador = new Audio("./sfx/hitJugador.wav");
let sonidoPunto = new Audio("./sfx/marcar.wav");

let muteado = false;

const reproducirAudio = (indice) => {
    if (!muteado){
        switch (indice){
            case 0:
                sonidoPared.currentTime = 0;
                sonidoPared.play();
                break;
            case 1:
                sonidoJugador.currentTime = 0;
                sonidoJugador.play();
                break;
            case 2:
                sonidoPunto.currentTime = 0;
                sonidoPunto.play();
                break;
        }
    }
}


window.addEventListener('keydown',function(e){
    keyState[e.key] = true;
},true);
window.addEventListener('keyup',function(e){
    keyState[e.key] = false;
},true);

window.addEventListener('wheel',function (e){
    if (jugadorRaton !== 0 && !pausado)
    mover_paleta(jugadorRaton,(e.deltaY < 0),40);
},true);


const mover_paleta = (jugador, arriba, velocidad = 10) => {
    if (jugador === 1){
        if (arriba && paleta1.offsetTop >= 0) paleta1.style.top = (paleta1.offsetTop - velocidad) +"px";
        else if (paleta1.offsetTop < campoPartida.offsetHeight - 110) paleta1.style.top = (paleta1.offsetTop + velocidad) +"px";
    } else {
        if (arriba && paleta2.offsetTop >= 0) paleta2.style.top = (paleta2.offsetTop - velocidad) +"px";
        else if (paleta2.offsetTop < campoPartida.offsetHeight - 110) paleta2.style.top = (paleta2.offsetTop + velocidad) +"px";
    }
}

function terminarPartida() {
    location.reload()

}

function reiniciar_pelota(empezarDerecha = true) {
    pausado = true;
    rastro.style.display = "none";
    pelota.style.outline = "none";
    estadoPartida = [false, false];
    velocidadBasePaleta = 10;
    rastro.style.aspectRatio = "1/1.5";
    rastro.style.backgroundColor = "rgba(255, 255, 255, 0.63)";
    let random = Math.floor((Math.random() * (90 - 10) + 10));
    pelota.style.top = "calc("+ random + "% - 25px)";
    pelota.style.left = "calc(50% - 25px)";

    paleta1.style.top = "calc(50% - 60px)";
    paleta2.style.top = "calc(50% - 60px)";

    velocidadX = (empezarDerecha ? 5 + dificultad : -5 - dificultad);
    velocidadY = (empezarDerecha ? 5 + dificultad : -5 - dificultad);
    rebotes = 0;
    if (puntuaciones[0] === limitePuntos || limitePuntos === puntuaciones[1]){
        let index = (puntuaciones[0] < puntuaciones[1] ? 1 : 0);
        let ganador = nombres[index];
        alert("El jugador " + ganador + " ha ganado!!! Ratio: " + puntuaciones[index]+"/"+puntuaciones[+!index]);
        terminarPartida();
    } else{
        setTimeout(function() {
            pausado = false;
            ball_movement = setInterval(move_ball, 10);
        }, 3000);
    }
}

function pausarJuego() {
    pausado = true;
    clearInterval(ball_movement);
    let menuPausa = document.createElement("div");
    menuPausa.id = "menuPausa";
    let botonContinuar = document.createElement("button");
    botonContinuar.onclick = () => {
        pausado = false;
        ball_movement = setInterval(move_ball, 10);
        menuPausa.remove();
    }
    botonContinuar.innerText = translations[currentLanguage]['labelContinuar'];
    menuPausa.appendChild(botonContinuar);
    let botonSalir = document.createElement("button");
    botonSalir.onclick = () => location.reload();
    botonSalir.innerText = translations[currentLanguage]['labelSalir'];
    menuPausa.appendChild(botonSalir);
    document.getElementById("partida").appendChild(menuPausa);
}

function move_ball(){
    rastro.style.display = "block";
    pelota.style.top = (pelota.offsetTop + velocidadY) +"px";
    pelota.style.left = (pelota.offsetLeft + velocidadX) +"px";
    let angulo = -Math.atan2(velocidadX, velocidadY);

    // Convertir el ángulo de radianes a grados y establecer la rotación
    rastro.style.transform = "rotate(" + (angulo * (180 / Math.PI) + 180) + "deg)";
    if (rebotes % 2 === 0 && rebotes !== 0 && noSeHaChocado && Math.abs(velocidadX) <= velocidadPelotaMaxima) {
        noSeHaChocado = false;
        velocidadY = (velocidadY < 0 ? velocidadY - 1 : velocidadY + 1)
        velocidadX = (velocidadX < 0 ? velocidadX - 1 : velocidadX + 1);

    }

    if (jugadores === 0){
        paleta1.style.top = pelota.style.top;
        paleta2.style.top = pelota.style.top;
    }

    rastro.style.aspectRatio = "1/" + Math.max((Math.abs(velocidadX) - 4.5),1.5);
    if (Math.abs(velocidadX) >= 15 && !estadoPartida[1]){
        rastro.style.background = "rgba(0,60,255,0.63)";
        estadoPartida[1] = true;
        pelota.style.outline = "5px solid rgba(0,60,255,1)"
        velocidadBasePaleta += 5;
    }
    else if (Math.abs(velocidadX) >= 10 && !estadoPartida[0] && !estadoPartida[1]){
        estadoPartida[0] = true;
        rastro.style.background = "rgba(255,0,0,0.63)";
        pelota.style.outline = "5px solid rgba(255,0,0,1)"
        velocidadBasePaleta += 5;
    }

    if (keyState[teclaArribaJ1] || keyState[teclaAbajoJ1]) mover_paleta(1, keyState[teclaArribaJ1],velocidadBasePaleta);
    if (keyState[teclaArribaJ2] || keyState[teclaAbajoJ2]) mover_paleta(2, keyState[teclaArribaJ2],velocidadBasePaleta);

    if (keyState[teclaPausa]) pausarJuego();


    //Check Top
    if (pelota.offsetTop <= 0) {
        velocidadY = -velocidadY;
        reproducirAudio(0);
    }


    //Check right
    if (pelota.offsetLeft >= campoPartida.offsetWidth - 50){
        if (jugadores === 2 || jugadores === 0){
            clearInterval(ball_movement);
            puntuaciones[0]++;
            document.getElementById("scoreJ1").innerText = puntuaciones[0].toString();
            reiniciar_pelota(false);
            reproducirAudio(2);

        } else {
            velocidadX = -velocidadX;
            rebotes++;
            reproducirAudio(0);

        }
    }

    //Check bottom
    if (pelota.offsetTop  >= campoPartida.offsetHeight - 50) {
        velocidadY = -velocidadY;
        reproducirAudio(0);

    }

    //Check left

    if (pelota.offsetLeft <= 0){
        clearInterval(ball_movement);
        reproducirAudio(2);
        if (jugadores === 2 || jugadores === 0){
            puntuaciones[1]++;
            document.getElementById("scoreJ2").innerText = puntuaciones[1].toString();
            reiniciar_pelota()
        } else {
            alert("Has tenido una puntuación de: " + puntuaciones[0]);
            terminarPartida();
        }
    }
    // Check collision
    if (velocidadX < 0 && pelota.offsetLeft < (50+24) && pelota.offsetLeft > (50) && paleta1.offsetTop <= (pelota.offsetTop+radioPelota) && paleta1.offsetTop + 120 >= (pelota.offsetTop+radioPelota)) {
        velocidadX = -velocidadX;
        rebotes++;
        noSeHaChocado = true;
        reproducirAudio(1);

        if (jugadores === 1){
            puntuaciones[0]++;
            document.getElementById("scoreJ1").innerText = puntuaciones[0].toString();
        }
    }

    if (velocidadX > 0 && pelota.offsetLeft > (campoPartida.offsetWidth - 124) && pelota.offsetLeft > (campoPartida.offsetWidth - 104) && paleta2.offsetTop <= (pelota.offsetTop+radioPelota) && paleta2.offsetTop + 120 >= (pelota.offsetTop+radioPelota)) {
        velocidadX = -velocidadX;
        noSeHaChocado = true;
        rebotes++;
        reproducirAudio(1);

    }

}

const empezarPartida = () => {
    // if (document.getElementById("form").validate()) {
        estadoPartida = [false, false];
        let partida = document.getElementById("partida");
        partida.style.display = "block"
        document.getElementById("configPartida").style.display = "none";
        pelota = document.getElementById("pelota");
        rastro = document.getElementById("rastro");
        paleta1 = document.getElementById("controlador1");
        paleta2 = document.getElementById("controlador2");

        jugadores = parseInt(document.getElementById("numJugadores").value);

        if (!document.getElementById("audio").checked) muteado = true;

        switch (jugadores){
            case 2:
                if (document.getElementById("rueda2").checked) {
                    jugadorRaton = 2;
                } else if (document.getElementById("flecha2").checked){
                    teclaArribaJ2 = "ArrowUp";
                    teclaAbajoJ2 = "ArrowDown";
                } else {
                    teclaArribaJ2 = document.getElementById("teclaArriba2").value.toLowerCase();
                    teclaAbajoJ2 = document.getElementById("teclaAbajo2").value.toLowerCase();
                }
                nombres[1] = document.getElementById("nombre2").value === "" ? document.getElementById("nombreJ2").innerText : document.getElementById("nombre2").value;
                document.getElementById("nombreJ2").innerText = nombres[1];
                document.getElementById("controlador2").style.display = "block";
                document.getElementById("datosJ2").style.display = "block";
                limitePuntos = parseInt(document.getElementById("limitePuntos").value);
                // Quiero que ocurra el caso 1 si hay 2 jugadores
            case 1:
                nombres[0] = document.getElementById("nombre1").value === "" ? document.getElementById("nombreJ1").innerText : document.getElementById("nombre1").value;
                document.getElementById("nombreJ1").innerText = nombres[0];
                if (document.getElementById("rueda1").checked) {
                    jugadorRaton = 1;
                    console.log("1")
                } else if (document.getElementById("flecha1").checked){
                    teclaArribaJ1 = "ArrowUp";
                    teclaAbajoJ1 = "ArrowDown";
                } else {
                    teclaArribaJ1 = document.getElementById("teclaArriba1").value.toLowerCase();
                    teclaAbajoJ1 = document.getElementById("teclaAbajo1").value.toLowerCase();
                }
                break;
            case 0:
                document.getElementById("controlador2").style.display = "block";
                document.getElementById("datosJ2").style.display = "block";
                break;
        }


        dificultad = document.getElementById("dificultad").value - 1;
        rebotes = 0;
        velocidadX = 5 + dificultad;
        velocidadY = 5 + dificultad;
        velocidadBasePaleta = 10;
        campoPartida = document.getElementById("campo");
        ball_movement = setInterval(move_ball, 10);
    console.log(nombres)
    // } else alert("Rellena los controles");
}

function comprobarControles() {
    let formulario = document.getElementById("form");

    let teclaArriba1;
    let teclaAbajo1;
    let teclaArriba2;
    let teclaAbajo2;
    try{
            teclaArriba1 = document.getElementById("teclaArriba1").value.toLowerCase();
            teclaAbajo1 = document.getElementById("teclaAbajo1").value.toLowerCase();
    } catch (e) {
            teclaArriba1 = '';
            teclaAbajo1 = '';
        try {
            teclaArriba2 = document.getElementById("teclaArriba2").value.toLowerCase();
            teclaAbajo2 = document.getElementById("teclaAbajo2").value.toLowerCase();
        } catch (e) {
            teclaArriba2 = '';
            teclaAbajo2 = '';
        }
    }
    let lista = [teclaArriba1,teclaArriba2,teclaAbajo1,teclaAbajo2];
    console.log(lista)
    let algunControlRepetido = tieneRepetidos([teclaArriba1,teclaArriba2,teclaAbajo1,teclaAbajo2]);
    if (formulario.checkValidity() && !algunControlRepetido) empezarPartida();
    else alert("Hay algún control repetido.");
    return false;
}

function tieneRepetidos(teclas) {
    let arrayLimpio = teclas.filter(elemento => elemento !== '' && elemento !== undefined);
    return new Set(arrayLimpio).size !== arrayLimpio.length;
}

function comprobarNumJug(){
    let formulario = document.getElementById("formJug");
    if (formulario.checkValidity()) cargarConfigJugadores();
    return false;
}
