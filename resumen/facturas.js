// =====================================================
// DATOS
// =====================================================

let facturas = [];


// =====================================================
// ELEMENTOS
// =====================================================

const listaFacturas =
  document.getElementById(
    "listaFacturas"
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
// BUSCADOR
// =====================================================

buscador.addEventListener(
  "input",
  renderFacturas
);


// =====================================================
// CARGAR FACTURAS
// =====================================================

async function cargarFacturas(
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
        "⏳ Cargando facturas...";

    }


    const respuesta =
      await fetch(
        urlFacturas
      );


    const datos =
      await respuesta.json();


    // =====================
    // FACTURAS
    // =====================

    facturas =
      datos.facturas || [];


    renderFacturas();

  }catch(error){

    console.log(error);


    estado.style.display =
      "block";


    estado.innerHTML =
      "❌ Error al cargar facturas";

  }

}


// =====================================================
// FORMATEAR FECHA
// =====================================================

function formatearFecha(fecha){

  if(!fecha){
    return "-";
  }


  try{

    return new Date(fecha)
      .toLocaleDateString(
        "es-CL"
      );

  }catch{

    return fecha;

  }

}


// =====================================================
// RENDER
// =====================================================

function renderFacturas(){

  listaFacturas.innerHTML =
    "";


  const textoBusqueda =
    buscador.value
      .toLowerCase()
      .trim();


  const filtradas =
    facturas.filter(factura => {

      return JSON.stringify(
        factura
      )
      .toLowerCase()
      .includes(
        textoBusqueda
      );

    });


  // =====================
  // VACIO
  // =====================

  if(
    filtradas.length === 0
  ){

    estado.style.display =
      "block";


    estado.innerHTML =
      "📭 No hay facturas";

    return;

  }


  estado.style.display =
    "none";


  // =====================
  // CREAR CARDS
  // =====================

  filtradas.forEach(factura => {

    const card =
      document.createElement(
        "div"
      );


    card.classList.add(
      "resumen-card"
    );


    // =====================
    // PRODUCTOS
    // =====================

    let productosHTML =
      "<p>Sin productos</p>";


    if(
      factura.productos
    ){

      const productos =
        Array.isArray(
          factura.productos
        )
          ? factura.productos
          : [factura.productos];


      productosHTML =
        productos.map(producto => {

          // =====================
          // OBJETO
          // =====================

          if(
            typeof producto ===
            "object"
          ){

            return `

              <div class="producto-item">

                • ${
                  producto.nombre ||
                  producto.producto ||
                  JSON.stringify(producto)
                }

              </div>

            `;

          }


          // =====================
          // TEXTO
          // =====================

          return `

            <div class="producto-item">

              • ${String(producto)}

            </div>

          `;

        }).join("");

    }


    // =====================
    // FECHA
    // =====================

    const fechaFormateada =
      formatearFecha(
        factura.fecha
      );


    card.innerHTML = `

      <div class="card-header factura-header">

        <div>


        📄 Factura #${

            factura.numero_factura || "-"
        }

        </div>


        <button class="toggle-btn">

          ▼ Ver Productos

        </button>

      </div>


      <div class="card-body">

        <div class="info-row">

          <span class="info-label">

            Proveedor

          </span>

          <span class="info-value">

            ${factura.proveedor || "-"}

          </span>

        </div>


        <div class="info-row">

          <span class="info-label">

            Fecha

          </span>

          <span class="info-value">

            ${fechaFormateada}

          </span>

        </div>


        <div class="info-row">

          <span class="info-label">

            Total

          </span>

          <span class="info-value">

            ${factura.total || "-"}

          </span>

        </div>


        <!-- PRODUCTOS -->

        <div class="productos-box">

          ${productosHTML}

        </div>

      </div>

    `;


    // =====================
    // TOGGLE PRODUCTOS
    // =====================

    const toggleBtn =
      card.querySelector(
        ".toggle-btn"
      );


    const productosBox =
      card.querySelector(
        ".productos-box"
      );


    let abierto =
      false;


    productosBox.style.display =
      "none";


    toggleBtn.addEventListener(
      "click",
      () => {

        abierto = !abierto;


        if(abierto){

          productosBox.style.display =
            "block";


          toggleBtn.innerText =
            "▲ Ocultar Productos";

        }else{

          productosBox.style.display =
            "none";


          toggleBtn.innerText =
            "▼ Ver Productos";

        }

      }
    );


    listaFacturas.appendChild(
      card
    );

  });

}


// =====================================================
// AUTO ACTUALIZAR
// =====================================================

setInterval(() => {

  cargarFacturas();

}, 60000);


// =====================================================
// INIT
// =====================================================

cargarFacturas(true);