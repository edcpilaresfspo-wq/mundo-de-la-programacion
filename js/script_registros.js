const URL_API = "https://script.google.com/macros/s/AKfycbxCIk31wW7OvWpN0MvSqsPkl2Q5UUFRJ1MOA5EsZUXXUQhIvlnyTU2TPY48HAoB1BUsEQ/exec";

async function cargarDatos() {
    try {
        const res = await fetch(URL_API);
        const datos = await res.json();
        const contenedor = document.getElementById('listaDatos');

        if(datos.length === 0) {
            contenedor.innerHTML = "No hay datos guardados aún.";
            return;
        }
        // cargar datos donde se renderiza correctamente el nombre [0]
        contenedor.innerHTML = `
              <table border="1" style="border-collapse: collapse; width: 100%; text-align: center;">
                  <thead>
                      <tr>
                          <th>Nombre</th>

                      </tr>
                  </thead>
                  <tbody>
                      ${datos.map(fila => `
                          <tr>
                              <td><strong>${fila[0]}</strong></td>

                          </tr>
                      `).join('')}
                  </tbody>
              </table>
          `;
        

        // Renderiza correctamente el nombre [0] y el mensaje [1] de cada fila
       /* contenedor.innerHTML = datos.map(fila => `
            <p><strong>${fila[0]}:</strong> ${fila[3]}</p>
        `).join('');*/
    } catch (error) {
        console.error("Error al cargar:", error);
        document.getElementById('listaDatos').innerHTML = "Error al conectar con la base de datos.";
    }
}

cargarDatos();
