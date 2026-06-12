const URL_API = "https://script.google.com/macros/s/AKfycbxCIk31wW7OvWpN0MvSqsPkl2Q5UUFRJ1MOA5EsZUXXUQhIvlnyTU2TPY48HAoB1BUsEQ/exec";

async function cargarDatos() {
    try {
        const res = await fetch(URL_API);
        const datos = await res.json();
        const contenedor = document.getElementById('listaDatos');
        const contenedorDD = document.getElementById('datosDocente');
        var valorBuscado1 = "Entre_semana";
        var valorBuscado2 = "Fin_de_semana";
        
        if(datos.length === 0) {
            
            contenedor.innerHTML = "No hay datos guardados aún.";
            return;
        }
        contenedorDD.innerHTML = `
            <p><strong>${datos[0][0]}: </strong> ${datos[0][3]}</p>
        `;
        const filasFiltradas = datos.filter(fila => fila[3] === valorBuscado1 || fila[3] === valorBuscado2);
        // cargar datos donde se renderiza correctamente el nombre [0]
        contenedor.innerHTML = `
              <table border="1" style="border-collapse: collapse; width: 100%; text-align: center;">
                  <thead>
                      <tr>
                          <th>Nombre</th>

                      </tr>
                  </thead>
                  <tbody>
                      ${filasFiltradas.map(fila => `
                          <tr>
                              <td><strong>${fila[0]}</strong></td>

                          </tr>
                      `).join('')}
                  </tbody>
              </table>
          `;
                
    } catch (error) {
        console.error("Error al cargar:", error);
        document.getElementById('listaDatos').innerHTML = "Error al conectar con la base de datos.";
    }
}

cargarDatos();
