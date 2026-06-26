// URL de Google APPS Script
const URL_APIas = "https://script.google.com/macros/s/AKfycby3EdjvKY3bnmVYAOd4JlEegw-g8CAb2os7PyiAE5YQ55JG9rZBhKIwQJunrjJO4FBU/exec";
// primera: https://script.google.com/macros/s/AKfycbzLWHjbjJda5HnyVTRHF0FTPqN1glNQJvLmE-koc7y5FxBLzI-edeGL7mU-pa7djnmQ/exec
// Guardar Asistencia
document.getElementById('miFormularioDAsistencia').addEventListener('submit', async (e) => {
    e.preventDefault();

    const boton = e.target.querySelector('button[type="submit"]');

    if (boton.disabled) return;

    boton.disabled = true;
    const textoOriginal = boton.innerText;
    boton.innerText = "Guardando Asistencia...";

    const primerNombre = document.getElementById('primer_nombre').value.trim();
    const segundoNombre = document.getElementById('segundo_nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const folio = document.getElementById('folio').value.trim();

    let grupo = "";
    let tipo = "";

    // Valida si el código (folio) ya existe en Google Sheets
    try {
        const respuestaValidacion = await fetch(`${URL_APIas}?verificarFolio=${encodeURIComponent(folio)}`);
        const resultado = await respuestaValidacion.json();

        if (!resultado.existe) {
            alert(`El folio ingresado ( "${folio}" ) No pertenece a un Estudiante inscrito en este taller o ha ingresado su folio de manera incorrecta. Si estas inscrito(a), formalmente en el taller, intenta realizar nuevamente el registro de tu asistencia asegurandote de colocar tu folio correcto y si aun no puedes completar el registro, informaselo a tu Docente.`);
            boton.disabled = false;
            boton.innerText = textoOriginal;
            return; // Detiene el registro
            }

        if (resultado.hoja === "As_G1_ES" || resultado.hoja === "As_G2_FS") {
              alert("Ya ha registrado su asistencia.");
              boton.disabled = false;
              boton.innerText = textoOriginal;
              return; // Detiene el registro
            }else{
              if (resultado.datos.Primer_Nombre !== primerNombre) {
                alert("El Primer Nombre Ingresado no coincide con el registrado.");
                boton.disabled = false;
                boton.innerText = textoOriginal;
                return; // Detiene el registro
              }else if(resultado.datos.Segundo_Nombre !== segundoNombre){
                alert("El Segundo Nombre Ingresado no coincide con el registrado.");
                boton.disabled = false;
                boton.innerText = textoOriginal;
                return; // Detiene el registro
              }else if (resultado.datos.Apellidos !== apellidos) {
                alert("El(los) Apellido(s) Ingresado(s) no coincide(n) con el(los) registrado(s).");
                boton.disabled = false;
                boton.innerText = textoOriginal;
                return; // Detiene el registro
              }else if (resultado.hoja === "No_Ins_G1_ES" || resultado.hoja === "No_Ins_G2_FS") {
                alert("No esta Inscrito Formalmente en este ciclo. Si tiene dudas puede informaselo al Docente encargado del curso.");
                boton.disabled = false;
                boton.innerText = textoOriginal;
                return; // Detiene el registro
              }
            }

        grupo = resultado.datos.Nomenclatura_grupo;

        } catch (error) {
            console.error("Error al validar código (folio):", error);
            alert("Error al verificar el código (folio). Inténtalo de nuevo.");
            return;
        }

    if (grupo === "EDCIP10626") {
      tipo = "Grupo_1";
    }else if (grupo === "EDCIP30626") {
      tipo = "Grupo_2";
    }
    // Si el código (folio) no esta en Google Sheets , se guarda
    await fetch(URL_APIas, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primerNombre, segundoNombre, apellidos, folio, grupo, tipo })
    });

    alert('¡Asistencia registrada con éxito!');
    boton.disabled = false;
    boton.innerText = textoOriginal;
    document.getElementById('miFormularioDAsistencia').reset();
    // Cambia el estilo a 'none' para que no sea visible, en caso de que quisira ser visible seria 'block'
    /*document.getElementById("tituloFormulario").style.display = "none";
    document.getElementById("miFormulario").style.display = "none";
    document.getElementById("mensaje_bienvenida").style.display = "block";
    mensajeBienvenida(nombre);*/
});
