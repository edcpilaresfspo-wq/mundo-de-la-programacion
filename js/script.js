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
    document.getElementById("fecha").textContent = `${diaSemana}, ${dia} de ${mes} de ${año}`;

    // MOSTRAR HORA
    document.getElementById("hora").textContent = `Hora:${horas}:${minutos}:${segundos}`;
}
// ACTUALIZAR CADA SEGUNDO
setInterval(actualizarReloj, 1000);
// INICIAR RELOJ
actualizarReloj();

// Boton para registrar Datos
const botonRegistro = document.getElementById('btnRegistro');

const menuDecision = document.getElementById('menuDecision');
const btnIrFormWeb = document.getElementById('btnIrFormWeb');
const btnIrFormCurso = document.getElementById('btnIrFormCurso');
const btnCambiarARegistroWeb = document.getElementById('btnCambiarARegistroWeb');
const formRegistroWeb = document.getElementById('formRegistroWeb');
const formRegistroCurso = document.getElementById('formRegistroCurso');

let registro = "";

let nombreCursoG = "";
let tiempoImparteG = "";
let nombreGenericoCursoG = "";
let nomenclaturaG = "";
let estatusG = "Activo";

// Variable global para almacenar los datos de la consulta
let datosServidor = [];

// Obtener los elementos de los selectores del DOM
const selectCurso = document.getElementById("curso");
const selectModalidad = document.getElementById("modalidad");
const selectGrupo = document.getElementById("grupo");

// ÍNDICES DE LAS COLUMNAS EN TU HOJA DE GOOGLE SHEETS (Modifícalos si es necesario)
const COL_CURSO = 2;     // Ejemplo: Columna A
const COL_MODALIDAD = 3; // Ejemplo: Columna B
const COL_GRUPO = 5;     // Ejemplo: Columna C
const COL_VALOR_ADICIONAL = 16;

// Configurar el evento cuando cambia el CURSO ➔ Carga las Modalidades
selectCurso.addEventListener("change", () => {
  const cursoSeleccionado = selectCurso.value;
  selectModalidad.length = 1; // Resetea modalidad
  selectGrupo.length = 1;     // Resetea grupo

  if (!cursoSeleccionado) return;

  const modalidadesUnicas = new Set();
  datosServidor.forEach(fila => {
    if (fila[COL_CURSO] === cursoSeleccionado && fila[COL_MODALIDAD]) {
      modalidadesUnicas.add(fila[COL_MODALIDAD]);
    }
  });

  modalidadesUnicas.forEach(mod => {
    selectModalidad.appendChild(new Option(mod, mod));
  });
});

// Configurar el evento cuando cambia la MODALIDAD ➔ Carga los Grupos
selectModalidad.addEventListener("change", () => {
  const cursoSeleccionado = selectCurso.value;
  const modalidadSeleccionada = selectModalidad.value;
  selectGrupo.length = 1; // Resetea grupo

  if (!modalidadSeleccionada) return;

  const gruposUnicos = new Set();
  datosServidor.forEach(fila => {
    if (fila[COL_CURSO] === cursoSeleccionado &&
        fila[COL_MODALIDAD] === modalidadSeleccionada &&
        fila[COL_GRUPO]) {
      gruposUnicos.add(fila[COL_GRUPO]);
    }
  });

  gruposUnicos.forEach(grupo => {
    selectGrupo.appendChild(new Option(grupo, grupo));
  });
});


// Función auxiliar para ocultar todo
function ocultarTodo() {
  menuDecision.classList.add('oculto');
  formRegistroWeb.classList.add('oculto');
  formRegistroCurso.classList.add('oculto');
}

// Muestra los campos del formulario de registro
botonRegistro.addEventListener('click', () => {
  //document.getElementById("tituloFormulario").style.display = "block";
  //document.getElementById("miFormulario").style.display = "block";
  document.getElementById("contenedor_collage_unidades").style.display = "none";
  document.getElementById("imaUnidad0").style.display = "none";
  document.getElementById("mensaje_bienvenida").style.display = "none";

  ocultarTodo();
  menuDecision.classList.remove('oculto');

});

// Clic en "Registrarme en la Página"
btnIrFormWeb.addEventListener('click', () => {
  ocultarTodo();
  formRegistroWeb.classList.remove('oculto');
  /*document.getElementById("tituloFormulario").style.display = "block";
  document.getElementById("miFormulario").style.display = "block";*/
});

// Clic en "Registrarme para un Curso"
btnIrFormCurso.addEventListener('click', async (e) => {
  e.preventDefault();
  ocultarTodo();
  // formRegistroCurso.classList.remove('oculto');

  // Limpiar todos los selectores antes de realizar la nueva carga
  selectCurso.length = 1;
  selectModalidad.length = 1;
  selectGrupo.length = 1;

  // Valida si ya existe en Google Sheets un curso activo y obtiene los datos
  try {
      const respuestaVCA = await fetch(`${URL_API}?verificarEstatusG=${encodeURIComponent(estatusG)}`);
      // Guardamos el resultado directamente en la variable global compartida
      datosServidor = await respuestaVCA.json();

      if (datosServidor.length === 0) {
          alert(`No hay un curso ( "${estatusG}" ).`);
          formRegistroCurso.classList.add('oculto');
          document.getElementById("mensaje_bienvenida").style.display = "block";
          mensajeCursosNoActivos();
          return; // Detiene el proceso para registrar grupo
      }
      formRegistroCurso.classList.remove('oculto');
      // --- NUEVO: Llenar el primer selector de Cursos ---
      const cursosUnicos = new Set();
      datosServidor.forEach(fila => {
        if (fila[COL_CURSO]) {
          cursosUnicos.add(fila[COL_CURSO]);
        }
      });

      // Insertar los cursos únicos detectados en el menú
      cursosUnicos.forEach(curso => {
        selectCurso.appendChild(new Option(curso, curso));
      });
      // --------------------------------------------------

  } catch (error) {
      console.error("Error al validar estatus del grupo o cargar selectores:", error);
      alert("Error al verificar el estatus. Inténtalo de nuevo.");
      return;
  }
});

// NUEVA ACCIÓN INTUITIVA: Pasar de Curso a Registro Web directamente
btnCambiarARegistroWeb.addEventListener('click', () => {
  ocultarTodo(); // Oculta el formulario del curso actual
  formRegistroWeb.classList.remove('oculto'); // Muestra el de registro de forma inmediata
  /*document.getElementById("tituloFormulario").style.display = "block";
  document.getElementById("miFormulario").style.display = "block";*/
});

// Guardar datos
document.getElementById('miFormularioRU').addEventListener('submit', async (e) => {
    e.preventDefault();

    const boton = e.target.querySelector('button[type="submit"]');

    if (boton.disabled) return;

    boton.disabled = true;
    const textoOriginal = boton.innerText;
    boton.innerText = "Guardando...";

    const p_nombre = document.getElementById('primerNombre').value.trim();
    const s_nombre = document.getElementById('segundoNombre').value.trim();
    const p_apellido = document.getElementById('primerApellido').value.trim();
    const s_apellido = document.getElementById('segundoApellido').value.trim();
    const folio = document.getElementById('folio').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const perfil = document.getElementById('perfil').value.trim(); // este ID se MODIFICO

    let datoFechaHora = "Nada";
    if(dia < 10 && mesNum >= 10){
        datoFechaHora = "0"+dia+"-"+mesNum+"-"+año+" "+horas+":"+minutos+":"+segundos;
    }else if(dia >= 10 && mesNum < 10){
        datoFechaHora = dia+"-0"+mesNum+"-"+año+" "+horas+":"+minutos+":"+segundos;
    }else if(dia < 10 && mesNum < 10){
        datoFechaHora = "0"+dia+"-0"+mesNum+"-"+año+" "+horas+":"+minutos+":"+segundos;
    }

    // Valida si el código (folio) ya existe en Google Sheets
    try {
        const respuestaValidacion = await fetch(`${URL_API}?verificarCodigo=${encodeURIComponent(folio)}`);
        const resultado = await respuestaValidacion.json();

        if (resultado.existe) {
            alert(`El folio ingresado ( "${folio}" ) ya esta registrado en esta Web. Si no te habias registrado anteriormente Valida tu folio e intenta nuevamente realizar el registro asegurandote de colocar tu folio correcto.`);
            boton.disabled = false;
            boton.innerText = textoOriginal;
            return; // Detiene el registro
            }
        } catch (error) {
            console.error("Error al validar código (folio):", error);
            alert("Error al verificar el código (folio). Inténtalo de nuevo.");
            return;
        }

    registro = "RU";
    // Si el código (folio) no esta en Google Sheets , se guarda
    await fetch(URL_API, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_nombre, s_nombre, p_apellido, s_apellido, folio, correo, telefono, perfil, datoFechaHora, registro })
    });

    alert('¡Datos del Usuario registrados con éxito!');
    boton.disabled = false;
    boton.innerText = textoOriginal;
    document.getElementById('miFormularioRU').reset();
    // Cambia el estilo a 'none' para que no sea visible, en caso de que quisira ser visible seria 'block'
    /*document.getElementById("tituloFormularioRU").style.display = "none";
    document.getElementById("miFormularioRU").style.display = "none";*/
    formRegistroWeb.classList.add('oculto');
    document.getElementById("mensaje_bienvenida").style.display = "block";
    mensajeBienvenida(p_nombre);
});

// Registrar al curso
document.getElementById('miFormularioRUC').addEventListener('submit', async (e) => {
    e.preventDefault();

    const boton = e.target.querySelector('button[type="submit"]');

    if (boton.disabled) return;

    boton.disabled = true;
    const textoOriginal = boton.innerText;
    boton.innerText = "Guardando...";

    var nomCompleto = "";
    let nombre = "";
    const folioRUC = document.getElementById('folioRUC').value.trim();
    console.log("Folio: "+folioRUC);
    let correo = "";
    let telefono = "";
    const curso = document.getElementById('curso').value.trim();
    const modalidad = document.getElementById('modalidad').value.trim();
    const grupo = document.getElementById('grupo').value.trim();
    let nomenclatura = "";
    const pre = document.getElementById('pre').value.trim();

    let datoFechaHora = "Nada";
    if(dia < 10 && mesNum >= 10){
        datoFechaHora = "0"+dia+"-"+mesNum+"-"+año+" "+horas+":"+minutos+":"+segundos;
    }else if(dia >= 10 && mesNum < 10){
        datoFechaHora = dia+"-0"+mesNum+"-"+año+" "+horas+":"+minutos+":"+segundos;
    }else if(dia < 10 && mesNum < 10){
        datoFechaHora = "0"+dia+"-0"+mesNum+"-"+año+" "+horas+":"+minutos+":"+segundos;
    }

    // Valida si el código (folio) ya existe en Google Sheets
    try {
        const respuestaValidacion = await fetch(`${URL_API}?verificarCodigoDos=${encodeURIComponent(folioRUC)}`);
        const resultado = await respuestaValidacion.json();

        // --- NUEVA VALIDACIÓN DE BLOQUEO ---
        // Si la respuesta es un objeto y tiene la propiedad 'bloqueado'
        if (resultado && resultado.bloqueado === true) {
            alert(`El Usuario con el folio ingresado ( "${folioRUC}" ), ya se encuentra registrado en un curso en este ciclo. Puedes validar que estas en la lista de usuarios registrados (en el menu Registrados).`);
            // Aquí puedes decidir si vuelves a ocultar el formulario o rediriges al usuario
            boton.disabled = false;
            boton.innerText = textoOriginal;
            return; // Detiene el registro
        }

        if (!resultado.existe) {
            alert(`El folio ingresado ( "${folioRUC}" ) No esta registrado en esta Web. Registrate (Crear Cuenta) e intenta nuevamente realizar el registro en el curso deseado, asegurandote de colocar tu folio correcto.`);
            boton.disabled = false;
            boton.innerText = textoOriginal;
            return; // Detiene el registro
            }

        if (resultado.datos.Segundo_Nombre == "NP" && resultado.datos.Segundo_Apellido == "NP") {
              nomCompleto = resultado.datos.Primer_Nombre+" "+resultado.datos.Primer_Apellido;
          }else if(resultado.datos.Segundo_Nombre == "NP"){
                nomCompleto = resultado.datos.Primer_Nombre+" "+resultado.datos.Primer_Apellido+" "+resultado.datos.Segundo_Apellido;
          }else if(resultado.datos.Segundo_Apellido == "NP") {
                nomCompleto = resultado.datos.Primer_Nombre+" "+resultado.datos.Segundo_Nombre+" "+resultado.datos.Primer_Apellido;
          }else {
                nomCompleto = resultado.datos.Primer_Nombre+" "+resultado.datos.Segundo_Nombre+" "+resultado.datos.Primer_Apellido+" "+resultado.datos.Segundo_Apellido;
          }

          // agrego los datos faltantes para el Registro
          nombre = nomCompleto;
          correo = resultado.datos.Correo;
          telefono = resultado.datos.Telefono;
          nomenclatura = "";

        } catch (error) {
            console.error("Error al validar código (folio):", error);
            alert("Error al verificar el código (folio). Inténtalo de nuevo.");
            return;
        }


    // Obtener los valores actualmente seleccionados por el usuario
    const cursoSeleccionado = selectCurso.value;
    const modalidadSeleccionada = selectModalidad.value;
    const grupoSeleccionado = selectGrupo.value;

    // Validar que se hayan seleccionado todas las opciones obligatorias
    if (!cursoSeleccionado || !modalidadSeleccionada || !grupoSeleccionado) {
      alert("Por favor, selecciona todos los campos requeridos.");
      return;
    }

    // Buscar la fila exacta en los datos guardados en memoria
    const filaEncontrada = datosServidor.find(fila =>
      fila[COL_CURSO] === cursoSeleccionado &&
      fila[COL_MODALIDAD] === modalidadSeleccionada &&
      fila[COL_GRUPO] === grupoSeleccionado
    );

    // Extraer el valor si la fila existe
    if (filaEncontrada) {
      const valorExtra = filaEncontrada[COL_VALOR_ADICIONAL];
      nomenclatura = valorExtra;
      console.log("¡Valor encontrado!", valorExtra);
      // Aquí puedes usar 'valorExtra' para guardarlo en un input oculto, enviarlo a otra API, etc.

    } else {
      console.warn("No se encontró ninguna coincidencia exacta en los datos.");
    }

    registro = "RUC";
    // Si el código (folio) no esta en Google Sheets , se guarda
    await fetch(URL_API, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, folioRUC, correo, telefono, curso, modalidad, grupo, nomenclatura, pre, datoFechaHora, registro })
    });

    alert('¡Datos del Usuario para el curso en este ciclo registrados con éxito!');
    boton.disabled = false;
    boton.innerText = textoOriginal;
    document.getElementById('miFormularioRUC').reset();
    // Cambia el estilo a 'none' para que no sea visible, en caso de que quisira ser visible seria 'block'
    formRegistroCurso.classList.add('oculto');
    document.getElementById("mensaje_bienvenida").style.display = "block";
    mensajeBienvenida2(nombre);
});

//mensaje de bienvenida a la Web
function mensajeBienvenida(nom){
  /*window.location.href = "./pages/juego.html";*/
  var mensaje = `Hola ${nom}. Bienvenido(a) a este gran mundo de la programación. En este mundo prodras aprender sobre temas como Algoritmos,
  Lenguajes de Programacion, Variables, Operadores, Condicionales, Bucles y mucho mas, ademas tambien tendras la oportunidad de aprender
  a utilizar aplicaciones, que mas adelante a algunas les conoceras como editores o IDEs, como lo son Scratch, PSeInt, Atom, etc, con todo
  ello podras desarrollar habilidades interesantes que te permitiran abrirte paso y crecer como un gran programador. Ahora que te has registrado
  en esta Web puedes validar si ya esta activo un curso para este ciclo, esto le puedes confirmar selecionando el boton, que ya conoces y que
  esta en el menu, llamado Registrate y de las opciones que aparezcan debes elegir la opcion de Registrarme para un Curso.`;
  const contenedor = document.getElementById('mensaje_bienvenida');
  contenedor.innerHTML = mensaje;
  cargarDatos();
}

//mensaje de bienvenida al Curso
function mensajeBienvenida2(nom){
  /*window.location.href = "./pages/juego.html";*/
  var mensaje = `Hola ${nom}. Bienvenido(a) a este curso que forma parte del gran mundo de la programación. Ahora empezaras a desarrollar
  habilidades interesantes que te permitiran abrirte paso y crecer como un gran programador.
  En esta pagina, ya en este momento, puedes validar que estas en la lista de usuarios registrados (en el menu Registrados) y tambien puedes
  ingresar a un juego realizado especialmente para ti en estos primeros pasos (el cual puedes ubicar en el menu: Juego). Te recomiendo, para
  que comiences con buen pie, que siempre sigas las indicaciones.`;
  const contenedor = document.getElementById('mensaje_bienvenida');
  contenedor.innerHTML = mensaje;
  cargarDatos();
}

//mensaje de bienvenida al Curso
function mensajeCursosNoActivos(){
  /*window.location.href = "./pages/juego.html";*/
  var mensaje = `Apreciado usuario, le informamos que aun no se encuentra activo ningun curso para este ciclo. Te recomiento estar atento
  ya que posiblemente pronto se activaran cursos de tu interes. Normalmente los cursos se activan en las dos primeras semanas de cada mes.
  De igual manera gracias por el interes en participar en los cursos y formarte en este gran mundo de la programacion.`;
  const contenedor = document.getElementById('mensaje_bienvenida');
  contenedor.innerHTML = mensaje;
  //cargarDatos();
}

