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

    let asistenciaFallida = 0;
    let textoAsistenciaFallida = "";
    let tipoAsistenciaFallida = 0;
    let notaAF = "";

    let fValidarFG1 = "123PRU45";
    let fValidarFG2 = "123PRU46";

    // Valida si el código (folio) ya existe en Google Sheets
    try {
        // Ejecutamos varias peticiones en paralelo
        const [respuestaValidacion, respuestaStatusFG1, respuestaStatusFG2] = await Promise.all([
          fetch(`${URL_APIas}?verificarFolio=${encodeURIComponent(folio)}`),
          fetch(`${URL_APIas}?verificarFolio=${encodeURIComponent(fValidarFG1)}`),
          fetch(`${URL_APIas}?verificarFolio=${encodeURIComponent(fValidarFG2)}`)
        ]);

        // Convertimos varias respuestas a JSON también en paralelo
        const [resultado, resultadoStatusFG1, resultadoStatusFG2] = await Promise.all([
          respuestaValidacion.json(),
          respuestaStatusFG1.json(),
          respuestaStatusFG2.json()
        ]);

        if (resultado.existe) {
          // validamos si los formularios de asistencia estan cerrados
          if (resultado.datos.Nomenclatura_grupo === resultadoStatusFG1.datos.Nomenclatura_grupo && resultadoStatusFG1.datos.Status === "Cerrado") {
            textoAsistenciaFallida = "El formulario de asistencia, de su grupo de entre semana, esta cerrado";
            alert(textoAsistenciaFallida);
            boton.disabled = false;
            boton.innerText = textoOriginal;

            asistenciaFallida = 1;
          }else if (resultado.datos.Nomenclatura_grupo === resultadoStatusFG2.datos.Nomenclatura_grupo && resultadoStatusFG2.datos.Status === "Cerrado") {
            textoAsistenciaFallida = "El formulario de asistencia, de su grupo de fin de semana, esta cerrado";
            alert(textoAsistenciaFallida);
            boton.disabled = false;
            boton.innerText = textoOriginal;

            asistenciaFallida = 1;
          }

          if (asistenciaFallida === 1) {
            grupo = resultado.datos.Nomenclatura_grupo;
            notaAF = "GC - "+ textoAsistenciaFallida;
            tipo = "asistencia_Fallida";
            // Si el formulario esta cerrado , se guarda la accion fallida
            await fetch(URL_APIas, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ primerNombre, segundoNombre, apellidos, folio, grupo, notaAF, tipo })
            });
            return; // Detiene el registro
          }

        }

        if (!resultado.existe) {
            textoAsistenciaFallida = `El folio ingresado ( ${folio} ) No pertenece a un Estudiante inscrito en un curso de este ciclo o ha ingresado su folio de manera incorrecta. Si estas inscrito(a), formalmente en el taller, intenta realizar nuevamente el registro de tu asistencia asegurandote de colocar tu folio correcto y si aun no puedes completar el registro, informaselo a tu Docente.`;
            alert(textoAsistenciaFallida);
            boton.disabled = false;
            boton.innerText = textoOriginal;
            grupo = "GRUPO00000";
            notaAF = "ENR - "+ textoAsistenciaFallida;
            tipo = "asistencia_Fallida";
            // Si no se encuenta el folio registrado en un grupo de este ciclo, se guarda la accion fallida
            await fetch(URL_APIas, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ primerNombre, segundoNombre, apellidos, folio, grupo, notaAF, tipo })
            });
            return; // Detiene el registro
            }

        if (resultado.hoja === "As_G1_ES" || resultado.hoja === "As_G2_FS") {
              textoAsistenciaFallida = `Hola ${primerNombre}. Te recuerdo que, en este formulario, ya has registrado tu asistencia a la clase de hoy.`;
              alert(textoAsistenciaFallida);
              boton.disabled = false;
              boton.innerText = textoOriginal;
              grupo = resultado.datos.Nomenclatura_grupo;
              notaAF = "AR - "+ textoAsistenciaFallida;
              tipo = "asistencia_Fallida";
              // Si ya ha registrado su asistencia en un grupo de este ciclo, se guarda la accion fallida
              await fetch(URL_APIas, {
                  method: 'POST',
                  mode: 'no-cors',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ primerNombre, segundoNombre, apellidos, folio, grupo, notaAF, tipo })
              });
              return; // Detiene el registro
            }else{
              if (resultado.datos.Primer_Nombre !== primerNombre) {
                textoAsistenciaFallida = "El Primer Nombre Ingresado no coincide con el registrado.";
                alert(textoAsistenciaFallida);
                boton.disabled = false;
                boton.innerText = textoOriginal;
                asistenciaFallida = 1;
                tipoAsistenciaFallida = 1;
              }else if(resultado.datos.Segundo_Nombre !== segundoNombre){
                textoAsistenciaFallida = "El Segundo Nombre Ingresado no coincide con el registrado.";
                alert(textoAsistenciaFallida);
                boton.disabled = false;
                boton.innerText = textoOriginal;
                asistenciaFallida = 1;
                tipoAsistenciaFallida = 1;
              }else if (resultado.datos.Apellidos !== apellidos) {
                textoAsistenciaFallida = "El(los) Apellido(s) Ingresado(s) no coincide(n) con el(los) registrado(s).";
                alert(textoAsistenciaFallida);
                boton.disabled = false;
                boton.innerText = textoOriginal;
                asistenciaFallida = 1;
                tipoAsistenciaFallida = 1;
              }else if (resultado.hoja === "No_Ins_G1_ES" || resultado.hoja === "No_Ins_G2_FS") {
                textoAsistenciaFallida = `Hola ${primerNombre}. Te comento que no has logrado formalizar tu Inscripcion en el curso de este ciclo. Si tienes dudas puedes informarselo al Docente encargado de impartir el curso.`;
                alert(textoAsistenciaFallida);
                boton.disabled = false;
                boton.innerText = textoOriginal;
                asistenciaFallida = 1;
                tipoAsistenciaFallida = 2;
              }

              if (asistenciaFallida === 1) {
                if (tipoAsistenciaFallida === 1) {
                  grupo = resultado.datos.Nomenclatura_grupo;
                  notaAF = "DE - "+ textoAsistenciaFallida;
                  tipo = "asistencia_Fallida";
                }else if (tipoAsistenciaFallida === 2) {
                  grupo = resultado.datos.Nomenclatura_grupo;
                  notaAF = "ENIF";
                  tipo = "asistencia_Fallida_No_Ins";
                }
                // Si los datos ingresados no coinciden, se guarda la accion fallida
                await fetch(URL_APIas, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ primerNombre, segundoNombre, apellidos, folio, grupo, notaAF, tipo })
                });
                return;
              }
            }

        grupo = resultado.datos.Nomenclatura_grupo;

        } catch (error) {
            console.error("Error al validar código (folio):", error);
            alert("Error al verificar el código (folio). Inténtalo de nuevo.");
            return;
        }

    if (grupo === "EDCIP10926") {
      tipo = "Grupo_1";
    }else if (grupo === "EDCIP30926") {
      tipo = "Grupo_2";
    }
    // Si el código (folio) no esta en Google Sheets , se guarda
    await fetch(URL_APIas, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primerNombre, segundoNombre, apellidos, folio, grupo, tipo })
    });

    alert(`Muy bien ${primerNombre}. ¡Tu Asistencia ha sido registrada con éxito!`);
    boton.disabled = false;
    boton.innerText = textoOriginal;
    document.getElementById('miFormularioDAsistencia').reset();
    // Cambia el estilo a 'none' para que no sea visible, en caso de que quisira ser visible seria 'block'
    /*document.getElementById("tituloFormulario").style.display = "none";
    document.getElementById("miFormulario").style.display = "none";
    document.getElementById("mensaje_bienvenida").style.display = "block";
    mensajeBienvenida(nombre);*/
});
