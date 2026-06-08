// URL de Google APPS Script
const URL_API = "https://script.google.com/macros/s/AKfycbxCIk31wW7OvWpN0MvSqsPkl2Q5UUFRJ1MOA5EsZUXXUQhIvlnyTU2TPY48HAoB1BUsEQ/exec";
let diaSemana = "Nada";
let dia = 0;
let mes = 0;
let mesNum = 0;
let año = 0;
let horas = 0;
let minutos = 0;
let segundos = 0;
function actualizarReloj(){
    // CREAR FECHA
    const ahora = new Date();
    // DIAS
    const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    // MESES
    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

    // OBTENER DATOS
    diaSemana = dias[ahora.getDay()];
    dia = ahora.getDate();
    mesNum = ahora.getMonth();
    mes = meses[mesNum];
    año = ahora.getFullYear();

    horas = ahora.getHours();
    minutos = ahora.getMinutes();
    segundos = ahora.getSeconds();

    // AGREGAR 0 SI ES MENOR A 10
    horas = horas < 10 ? "0" + horas : horas;
    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;

    // MOSTRAR FECHA
    document.getElementById("fecha").textContent =
        `${diaSemana}, ${dia} de ${mes} de ${año}`;

    // MOSTRAR HORA
    document.getElementById("hora").textContent =
        `Hora:${horas}:${minutos}:${segundos}`;
}
// ACTUALIZAR CADA SEGUNDO
setInterval(actualizarReloj, 1000);
// INICIAR RELOJ
actualizarReloj();

// Guardar datos
document.getElementById('miFormulario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const folio = document.getElementById('folio').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const grupo = document.getElementById('grupo').value.trim();
    const fechaActual = document.getElementById('fecha').value.trim();
    const horaActual = document.getElementById('hora').value.trim();
    const nomenclaturaGrupo = "Ninguna";
    let añoCorto = +String(año).slice(-2);
    if(grupo === "Entre_semana"){
        nomenclaturaGrupo = "1"+mes+""+añoCorto;
    }else{
        nomenclaturaGrupo = "3"+mes+""+añoCorto;
    }

    const datoFechaHora = dia+"-"+mesNum+"-"+año+" "+horaActual;

    // Valida si el código (folio) ya existe en Google Sheets
    try {
        const respuestaValidacion = await fetch(`${URL_API}?verificarCodigo=${encodeURIComponent(folio)}`);
        const resultado = await respuestaValidacion.json();

        if (resultado.existe) {
            alert(`El folio ingresado ( "${folio}" ) ya esta registrado. Valida tu nombre en la lista de registrados y sino estas intenta nuevamente realizar el registro asegurandote de colocar tu folio correcto.`);
            return; // Detiene el registro
            }
        } catch (error) {
            console.error("Error al validar código (folio):", error);
            alert("Error al verificar el código (folio). Inténtalo de nuevo.");
            return;
        }

    // Si el código (folio) no esta en Google Sheets , se guarda
    await fetch(URL_API, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, folio, correo, grupo, nomenclaturaGrupo, datoFechaHora })
    });

    alert('¡Datos del Usuario registrados con éxito!');
    document.getElementById('miFormulario').reset();
    // Cambia el estilo a 'none' para que no sea visible, en caso de que quisira ser visible seria 'block'
    document.getElementById("tituloFormulario").style.display = "none";
    document.getElementById("miFormulario").style.display = "none";
    document.getElementById("mensaje_bienvenida").style.display = "block";
    mensajeBienvenida(nombre);
});

//mensaje de bienvenida
function mensajeBienvenida(nom){
  /*window.location.href = "./pages/juego.html";*/
  var mensaje = `Hola ${nom}. Bienvenido(a) a este gran mundo de la programación. En este mundo prodras aprender sobre temas como Algoritmos, 
  Lenguajes de Programacion, Variables, Operadores, Condicionales, Bucles y mucho mas, ademas tambien tendras la oportunidad de aprender
  a utilizar aplicaciones, que mas adelante a algunas les conoceras como editores o IDEs, como lo son Scratch, PSeInt, Atom, etc, con todo
  ello podras desarrollar habilidades interesantes que te permitiran abrirte paso y crecer como un gran programador.
  En esta pagina, ya en este momento, puedes validar que estas en la lista de usuarios registrados (en el menu Registrados) y tambien puedes
  ingresar a un juego realizado especialmente para ti en estos primeros pasos (el cual puedes ubicar en el menu: Juego). Te recomiendo, para
  que comienes con buen pie, que siempre sigas las indicaciones.`;
  const contenedor = document.getElementById('mensaje_bienvenida');
  contenedor.innerHTML = mensaje;
  cargarDatos();
}

