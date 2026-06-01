// URL de Google APPS Script
const URL_API = "https://script.google.com/macros/s/AKfycbxCIk31wW7OvWpN0MvSqsPkl2Q5UUFRJ1MOA5EsZUXXUQhIvlnyTU2TPY48HAoB1BUsEQ/exec";

// Guardar datos
document.getElementById('miFormulario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const folio = document.getElementById('folio').value.trim();

    // 1. Validar si el código (mensaje) ya existe en Google Sheets
    try {
        const respuestaValidacion = await fetch(`${URL_API}?verificarCodigo=${encodeURIComponent(folio)}`);
        const resultado = await respuestaValidacion.json();

        if (resultado.existe) {
            alert(`El folio ingresado ( "${folio}" ) ya esta registrado. Valida si ya te registraste y sino lo estas intentalo nuevamente con tu folio.`);
            return; // Detiene el registro
            }
        } catch (error) {
            console.error("Error al validar código:", error);
            alert("Error al verificar el código. Inténtalo de nuevo.");
            return;
        }

    // 2. Si el código está libre, se guarda
    await fetch(URL_API, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, folio })
    });

    alert('¡Datos enviados con éxito!');
    document.getElementById('miFormulario').reset();
    cargarDatos();
});

// Leer y mostrar datos
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

cargarDatos();
