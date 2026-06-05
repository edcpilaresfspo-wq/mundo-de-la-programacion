// URL de Google APPS Script
const URL_API = "https://script.google.com/macros/s/AKfycbxCIk31wW7OvWpN0MvSqsPkl2Q5UUFRJ1MOA5EsZUXXUQhIvlnyTU2TPY48HAoB1BUsEQ/exec";

// Guardar datos
document.getElementById('miFormulario').addEventListener('submit', async (e) => {
    e.preventDefault();
    /*const nombre = document.getElementById('nombre').value.trim();*/
    const folio = document.getElementById('folio').value.trim();

    // Valida si el código (folio) ya existe en Google Sheets
    try {
        const respuestaValidacion = await fetch(`${URL_API}?verificarFolio=${encodeURIComponent(folio)}`);
        const resultado = await respuestaValidacion.json();

        if (resultado.existe) {
            alert(`El folio ingresado ( "${folio}" ) esta registrado. Puede empezar a Jugar. Suerte!`);
          }else{
            alert(`El folio ingresado ( "${folio}" ) No esta registrado.`);
            return; // Detiene el registro
          }
        } catch (error) {
            console.error("Error al validar código (folio):", error);
            alert("Error al verificar el código (folio). Inténtalo de nuevo.");
            return;
        }

    document.getElementById('miFormulario').reset();
    // Cambia el estilo a 'none' para que no sea visible, en caso de que quisira ser visible seria 'block'
    document.getElementById("tituloFormulario").style.display = "none";
    document.getElementById("miFormulario").style.display = "none";
    document.getElementById("mensaje_juego").style.display = "block";
    mensajeJuego();
});

//mensaje de bienvenida
function mensajeJuego(){
  /*window.location.href = "./pages/juego.html";*/
  var mensaje = `Bienvenido(a) a esta seccion de juego. En este podras validar tus conocimientos básicos.`;
  const contenedor = document.getElementById('mensaje_juego');
  contenedor.innerHTML = mensaje;
}
