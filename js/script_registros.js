const URL_API = "https://script.google.com/macros/s/AKfycbxCIk31wW7OvWpN0MvSqsPkl2Q5UUFRJ1MOA5EsZUXXUQhIvlnyTU2TPY48HAoB1BUsEQ/exec";
alert("se ha ingresado al js registros"+URL_API);

async function cargarDatos() {
    alert("Ha ingresado a cargarDatos()");
    try {
        const res = await fetch(URL_API);
        const datos = await res.json();
        const contenedor = document.getElementById('listaDatos');

        if(datos.length === 0) {
            contenedor.innerHTML = "No hay datos guardados aún.";
            return;
        }

        // Renderiza correctamente el nombre [0] y el mensaje [1] de cada fila
        contenedor.innerHTML = datos.map(fila => `
            <p><strong>${fila[0]}:</strong> ${fila[1]}</p>
        `).join('');
    } catch (error) {
        console.error("Error al cargar:", error);
        document.getElementById('listaDatos').innerHTML = "Error al conectar con la base de datos.";
    }
}

cargarDatos();
