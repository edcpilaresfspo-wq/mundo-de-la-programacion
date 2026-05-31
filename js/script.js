
const URL_API = "https://script.google.com/macros/s/AKfycbxCIk31wW7OvWpN0MvSqsPkl2Q5UUFRJ1MOA5EsZUXXUQhIvlnyTU2TPY48HAoB1BUsEQ/exec";

// Guardar datos
document.getElementById('miFormulario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const mensaje = document.getElementById('folio').value;

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
