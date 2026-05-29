// =====================================================
// DATOS
// =====================================================

let productos = [];


// =====================================================
// ELEMENTOS
// =====================================================

const listaInventario =
  document.getElementById(
    "listaInventario"
  );


const buscador =
  document.getElementById(
    "buscador"
  );


const estado =
  document.getElementById(
    "estado"
  );


// =====================================================
// SELECT CATEGORIAS
// =====================================================

const filtroCategoria =
  document.createElement(
    "select"
  );


filtroCategoria.classList.add(
  "buscador-input"
);


filtroCategoria.innerHTML = `

  <option value="">

    📦 Todas las categorías

  </option>

`;


// =====================================================
// INSERTAR SELECT
// =====================================================

buscador.parentElement.appendChild(
  filtroCategoria
);


// =====================================================
// BUSCADOR
// =====================================================

buscador.addEventListener(
  "input",
  renderInventario
);


filtroCategoria.addEventListener(
  "change",
  renderInventario
);


// =====================================================
// CARGAR INVENTARIO
// =====================================================

async function cargarInventario(
  mostrarCarga = false
){

  try{

    // =====================
    // MOSTRAR CARGA
    // =====================

    if(mostrarCarga){

      estado.style.display =
        "block";


      estado.innerHTML =
        "⏳ Cargando inventario...";

    }


    const respuesta =
      await fetch(
        urlInventario
      );


    const datos =
      await respuesta.json();


    // =====================
    // PRODUCTOS
    // =====================

    productos =
      datos.productos || [];


    // =====================
    // CATEGORIAS
    // =====================

    cargarCategorias();


    renderInventario();

  }catch(error){

    console.log(error);


    estado.style.display =
      "block";


    estado.innerHTML =
      "❌ Error al cargar inventario";

  }

}


// =====================================================
// CARGAR CATEGORIAS
// =====================================================

function cargarCategorias(){

  const categorias =
    [
      ...new Set(

        productos.map(producto => {

          return (
            producto.categoria ||
            "Sin categoría"
          );

        })

      )
    ];


  filtroCategoria.innerHTML = `

    <option value="">

      📦 Todas las categorías

    </option>

  `;


  categorias.forEach(categoria => {

    filtroCategoria.innerHTML += `

      <option value="${categoria}">

        ${categoria}

      </option>

    `;

  });

}


// =====================================================
// RENDER
// =====================================================

function renderInventario(){

  const textoBusqueda =
    buscador.value
      .toLowerCase()
      .trim();


  const categoriaSeleccionada =
    filtroCategoria.value;


  const filtrados =
    productos.filter(producto => {


      const coincideBusqueda =

        JSON.stringify(producto)
          .toLowerCase()
          .includes(
            textoBusqueda
          );


      const coincideCategoria =

        categoriaSeleccionada === ""

        ||

        (
          producto.categoria ||
          "Sin categoría"
        ) === categoriaSeleccionada;


      return (

        coincideBusqueda &&
        coincideCategoria

      );

    });


  // =====================
  // VACIO
  // =====================

  if(
    filtrados.length === 0
  ){

    estado.style.display =
      "block";


    estado.innerHTML =
      "📭 No hay productos";


    listaInventario.innerHTML =
      "";

    return;

  }


  estado.style.display =
    "none";


  // =====================
  // TABLA
  // =====================

  listaInventario.innerHTML = `

    <div class="tabla-container">

      <table class="tabla-inventario">

        <thead>

          <tr>

            <th>

              Producto

            </th>

            <th>

              Stock

            </th>

          </tr>

        </thead>


        <tbody>

          ${filtrados.map(producto => `

            <tr>

              <td>

                <strong>

                  ${
                    producto.nombre ||
                    producto.producto ||
                    "-"
                  }

                </strong>

              </td>


              <td class="stock-cell">

                ${
                  producto.stock || 0
                }

              </td>

            </tr>

          `).join("")}

        </tbody>

      </table>

    </div>

  `;

}


// =====================================================
// INIT
// =====================================================

cargarInventario(true);