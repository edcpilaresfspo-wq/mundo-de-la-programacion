// URL de Google APPS Script
const URL_API = "https://script.google.com/macros/s/AKfycbxCIk31wW7OvWpN0MvSqsPkl2Q5UUFRJ1MOA5EsZUXXUQhIvlnyTU2TPY48HAoB1BUsEQ/exec";

// Guardar datos
document.getElementById('miFormulario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const folio = document.getElementById('folio').value.trim();

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
        body: JSON.stringify({ nombre, folio })
    });

    alert('¡Datos del Usuario registrados con éxito!');
    document.getElementById('miFormulario').reset();
    // Cambia el estilo a 'none' para que no sea visible, en caso de que quisira ser visible seria 'block'
    document.getElementById("miFormulario").style.display = "none";
    document.getElementById("mensaje_bienvenida").style.display = "block";
    mensajeBienvenida(nombre);
    /*cargarDatos();*/
});

//mensaje de bienvenida
function mensajeBienvenida(nom){
  /*window.location.href = "./pages/juego.html";*/
  var mensaje = `Hola ${nom}. Bienvenido(a) a este gran mundo de la programación. En este podras desarrollar habilidades interesantes.`;
  const contenedor = document.getElementById('mensaje_bienvenida');
  contenedor.innerHTML = mensaje;
  cargarDatos();
}

// Leer y mostrar datos
/*
async function cargarDatos() {
    try {
        const res = await fetch(URL_API);
        const datos = await res.json();
        const contenedor = document.getElementById('listaDatos');
        
        if(datos.length === 0) {
            contenedor.innerHTML = "No hay datos guardados aún.";
            return;
        }

        // Renderiza correctamente el nombre [0] y el folio [1] de cada fila
        contenedor.innerHTML = datos.map(fila => `
            <p><strong>${fila[0]}:</strong> ${fila[1]}</p>
        `).join('');
    } catch (error) {
        console.error("Error al cargar:", error);
        document.getElementById('listaDatos').innerHTML = "Error al conectar con la base de datos.";
    }
}

cargarDatos();*/
