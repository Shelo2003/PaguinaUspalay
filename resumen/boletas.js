// =====================================================
// DATOS
// =====================================================

let boletas = [];


// =====================================================
// ELEMENTOS
// =====================================================

const listaBoletas =
  document.getElementById(
    "listaBoletas"
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
  renderBoletas
);


// =====================================================
// CARGAR BOLETAS
// =====================================================

async function cargarBoletas(
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
        "⏳ Cargando boletas...";

    }


    const respuesta =
      await fetch(
        urlBoletas
      );


    const datos =
      await respuesta.json();


    // =====================
    // BOLETAS
    // =====================

    boletas =
      datos.boletas || [];


    renderBoletas();

  }catch(error){

    console.log(error);


    estado.style.display =
      "block";


    estado.innerHTML =
      "❌ Error al cargar boletas";

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

function renderBoletas(){

  listaBoletas.innerHTML =
    "";


  const textoBusqueda =
    buscador.value
      .toLowerCase()
      .trim();


  const filtradas =
    boletas.filter(boleta => {

      return JSON.stringify(
        boleta
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
      "📭 No hay boletas";

    return;

  }


  estado.style.display =
    "none";


  // =====================
  // CREAR CARDS
  // =====================

  filtradas.forEach(boleta => {

    const card =
      document.createElement(
        "div"
      );


    card.classList.add(
      "resumen-card"
    );


    // =====================
    // FECHA
    // =====================

    const fechaFormateada =
      formatearFecha(
        boleta.fecha
      );


    // =====================
    // PRODUCTOS
    // =====================

    let productosHTML =
      "<p>Sin productos</p>";


    if(
      boleta.productos
    ){

      const productos =
        Array.isArray(
          boleta.productos
        )
          ? boleta.productos
          : [boleta.productos];


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


    card.innerHTML = `

      <div class="card-header factura-header">

        <div>

          🧾 Boleta #${
            boleta.numero_boleta || "-"
          }

        </div>


        <button class="toggle-btn">

          ▼ Ver Productos

        </button>

      </div>


      <div class="card-body">


        <!-- FECHA ARRIBA -->

        <div class="info-row">

          <span class="info-label">

            Fecha

          </span>

          <span class="info-value">

            ${fechaFormateada}

          </span>

        </div>


        <!-- LUGAR -->

        <div class="info-row">

          <span class="info-label">

            Lugar

          </span>

          <span class="info-value">

            ${
              boleta.lugar_compra ||
              "-"
            }

          </span>

        </div>


        <!-- TOTAL -->

        <div class="info-row">

          <span class="info-label">

            Total

          </span>

          <span class="info-value">

            ${
              boleta.total || "-"
            }

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


    listaBoletas.appendChild(
      card
    );

  });

}


// =====================================================
// AUTO ACTUALIZAR
// =====================================================

setInterval(() => {

  cargarBoletas();

}, 60000);


// =====================================================
// INIT
// =====================================================

cargarBoletas(true);