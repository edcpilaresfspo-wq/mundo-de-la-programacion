// URL de Google APPS Script
const URL_API = "https://script.google.com/macros/s/AKfycbxCIk31wW7OvWpN0MvSqsPkl2Q5UUFRJ1MOA5EsZUXXUQhIvlnyTU2TPY48HAoB1BUsEQ/exec";
const URL_API2 ="https://script.google.com/macros/s/AKfycbxWV44wm4vCIv_FvDLJCWUoF9ZA0InEihLIICzZJhrqhVim0vbVrWgF_RLaCUbc16k/exec";

// Guardar datos
document.getElementById('miFormulario').addEventListener('submit', async (e) => {
    e.preventDefault();
    /*const nombre = document.getElementById('nombre').value.trim();*/
    const folio = document.getElementById('folio').value.trim();

    let copiaFolio = folio;
    copiaFolio = copiaFolio.toUpperCase();

    if(folio != copiaFolio){
        alert("El folio ingresado, No coincide con el formato adecuado. Si no recuerda el formato puede validardo en la nota correspondiente al campo Folio Pilares del formulario de registro de la pagina principal (menu: Inicio)");
    }else{
        // Valida si el código (folio) ya existe en Google Sheets
        try {
            const respuestaValidacion = await fetch(`${URL_API}?verificarFolio=${encodeURIComponent(folio)}`);
            const resultado = await respuestaValidacion.json();
    
            if (!resultado.existe) {
                alert(`El folio ingresado ( "${folio}" ) No esta registrado.`);
                return; // Detiene el acceso al juego
              }
            } catch (error) {
                console.error("Error al validar código (folio):", error);
                alert("Error al verificar el código (folio). Inténtalo de nuevo.");
                return;
            }
    
        alert(`El folio ingresado ( "${folio}" ) esta registrado. Puede empezar a Jugar. Suerte!`);
        await fetch(URL_API2, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folio })
        });
        document.getElementById('miFormulario').reset();
        // Cambia el estilo a 'none' para que no sea visible, en caso de que quisira ser visible seria 'block'
        document.getElementById("tituloDatoAcceso").style.display = "none";
        document.getElementById("miFormulario").style.display = "none";
        document.getElementById("tituloJuego").style.display = "block";
        document.getElementById("mensaje_juego").style.display = "block";
        document.getElementById("juegoBienvenidos").style.display = "block";
        mensajeJuego();
    }

    
});

//mensaje de bienvenida
function mensajeJuego(){
  /*window.location.href = "./pages/juego.html";*/
  var mensaje = `Este juego consiste en validar tus conocimientos básicos para este gran mundo de la programación. En el centro y/o en 
  la esquina superior izquierda de la pantalla de juego, que esta debajo de este mensaje, aparece una bandera verde la cual debes 
  presionar para empezar a jugar, a partir de que presiones la bandera verde empezara la diversión y deberás seguir las indicaciones 
  o instrucciones o enunciados (concepto que veras mucho en programación). También te hago mención que se puede apreciar un octágono 
  de color rojo al lado de la banderita verde que está ubicada en la parte superior izquierda de la pantalla de juego, este sirve para 
  reiniciar el juego así que ten cuidado porque si le presionas empezaras desde el principio. ¡Presta mucha atención y Suerte!`;
  const contenedor = document.getElementById('mensaje_juego');
  contenedor.innerHTML = mensaje;
}
