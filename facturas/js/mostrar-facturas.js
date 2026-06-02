const container =
  document.getElementById(
    "facturas-container"
  );

const buscador =
  document.getElementById(
    "buscar"
  );

let facturasGlobal = [];


// =========================
// BLOQUEAR ACCIONES
// =========================

function bloquearAcciones(

  texto = "Procesando..."

){

  document.body.style.opacity =
    "0.6";

  document.body.style.pointerEvents =
    "none";


  document
    .querySelectorAll("button")
    .forEach(btn => {

      btn.disabled = true;

    });


  const overlay =
    document.createElement("div");

  overlay.id =
    "overlay-bloqueo";


  overlay.innerHTML = `

    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      color: white;
      font-size: 22px;
      font-weight: bold;
      backdrop-filter: blur(3px);
    ">

      ⏳ ${texto}

    </div>

  `;


  document.body.appendChild(
    overlay
  );

}


// =========================
// DESBLOQUEAR ACCIONES
// =========================

function desbloquearAcciones(){

  document.body.style.opacity =
    "1";

  document.body.style.pointerEvents =
    "auto";


  document
    .querySelectorAll("button")
    .forEach(btn => {

      btn.disabled = false;

    });


  const overlay =
    document.getElementById(
      "overlay-bloqueo"
    );


  if(overlay){

    overlay.remove();

  }

}


// =========================
// CARGAR FACTURAS
// =========================

async function cargarFacturas(
  mostrarCarga = false
){

  try{

    // =====================
    // MOSTRAR CARGA SOLO
    // AL ENTRAR
    // =====================

    if(mostrarCarga){

      container.innerHTML = `

        <div class="semana-title">

          ⏳ Cargando facturas...

        </div>

      `;

    }


    const respuesta =
      await fetch(url);

    const datos =
      await respuesta.json();


    facturasGlobal =
      datos.facturas || [];


    container.innerHTML = "";


    const grupos =
    agruparPorDia(
        facturasGlobal
    );


    Object.keys(grupos)
      .reverse()
      .forEach(semana => {

        // =====================
        // TOTAL DIA
        // =====================

        let totalSemana = 0;


        grupos[semana]
          .forEach(factura => {

            totalSemana +=
              Number(
                factura.total || 0
              );

          });


        const titulo =
          document.createElement(
            "div"
          );

        titulo.classList.add(
          "semana-title"
        );


        titulo.innerHTML = `

          <div class="dia-header">

            <div>

              📅 ${semana}

            </div>

            <div class="total-semana">

              Total del Día:
              $${totalSemana.toLocaleString("es-CL")}

            </div>

            <button
              class="btn-pdf-dia"
              data-dia="${semana}"
            >

              📄 PDF Día

            </button>

          </div>

        `;


        container.appendChild(
          titulo
        );

        const btnPdfDia =
          titulo.querySelector(
            ".btn-pdf-dia"
          );


        btnPdfDia.addEventListener(
          "click",
          () => {

            exportarPDFDia(

              semana,

              grupos[semana]

            );

          }
        );


        grupos[semana]
          .forEach(factura => {

            renderFactura(
              factura
            );

          });

      });

  }catch(error){

    console.log(error);

    showToast(
      "Error cargando facturas",
      "error"
    );

  }

}


// =========================
// FORMATEAR DINERO
// =========================

function formatearDinero(valor){

  return Number(valor || 0)
    .toLocaleString(
      "es-CL"
    );

}


// =========================
// FORMATEAR FECHA SIMPLE
// =========================

function formatearFechaSimple(fechaString){

  const fecha =
    new Date(fechaString);


  return fecha.toLocaleDateString(
    "es-CL",
    {

      year:"numeric",

      month:"2-digit",

      day:"2-digit"

    }

  );

}


// =========================
// RENDER FACTURA
// =========================

function renderFactura(factura){

  const card =
    document.createElement(
      "div"
    );

  card.classList.add(
    "factura-card"
  );


  let productosHTML = "";


  factura.productos.forEach(p => {

    productosHTML += `

      <tr>

        <td>${p.nombre}</td>

        <td>${p.cantidad}</td>

        <td>
          $${formatearDinero(p.precio)}
        </td>

      </tr>

    `;

  });


  card.innerHTML = `

    <div class="factura-header">

      <div>

        <strong>Factura:</strong>

        ${factura.numero_factura || "SIN N°"}

      </div>


      <div>

        <strong>Proveedor:</strong>

        ${factura.proveedor}

      </div>


      <div>

        <strong>Fecha:</strong>

        ${formatearFechaSimple(
          factura.fecha
        )}

      </div>


      <div style="display:flex; gap:10px;">

        <button class="btn-editar">

          Editar

        </button>


        <button class="btn-eliminar">

          Eliminar

        </button>


        <button class="btn-PDF">

          PDF

        </button>

      </div>

    </div>


    <div class="factura-detalle">

      <table border="1">

        <tr>

          <th>Producto</th>

          <th>Cantidad</th>

          <th>Precio</th>

        </tr>

        ${productosHTML}

      </table>


      <h3>

        Total:
        $${formatearDinero(
          factura.total
        )}

      </h3>

    </div>

  `;


  const detalle =
    card.querySelector(
      ".factura-detalle"
    );


  const btnEliminar =
    card.querySelector(
      ".btn-eliminar"
    );


  const btnEditar =
    card.querySelector(
      ".btn-editar"
    );


  const btnWORD =
    card.querySelector(
      ".btn-PDF"
    );


  detalle.style.display =
    "none";


  // =====================
  // TOGGLE
  // =====================

  card.querySelector(
    ".factura-header"
  ).addEventListener(
    "click",
    (e) => {

      if(
        e.target.tagName ===
        "BUTTON"
      ) return;


      detalle.style.display =

        detalle.style.display ===
        "none"

          ? "block"
          : "none";

    }
  );


  // =====================
  // ELIMINAR
  // =====================

  btnEliminar.addEventListener(
    "click",
    async (e) => {

      e.stopPropagation();


      if(
        !confirm(
          "¿Eliminar factura?"
        )
      ) return;


      try{

        bloquearAcciones(
          "Eliminando factura..."
        );


        btnEliminar.innerText =
          "Eliminando...";


        await fetch(url, {

          method:"POST",

          body:JSON.stringify({

            accion:
              "eliminarFactura",

            id:
              factura.id

          })

        });


        await cargarFacturas();


        showToast(
          "Factura eliminada",
          "warning"
        );

      }catch(error){

        console.log(error);

      }


      desbloquearAcciones();

    }
  );


  // =====================
  // EDITAR
  // =====================

  btnEditar.addEventListener(
    "click",
    (e) => {

      e.stopPropagation();


      document.body.style.opacity =
        "0.6";


      document.body.style.pointerEvents =
        "none";


      btnEditar.disabled = true;

      btnEditar.innerText =
        "Cargando...";


      const facturaCorregida = {

        ...factura,

        fecha:
          new Date(factura.fecha)
            .toISOString()
            .split("T")[0]

      };


      localStorage.setItem(

        "facturaEditar",

        JSON.stringify(
          facturaCorregida
        )

      );


      setTimeout(() => {

        window.location.href =
          "index.html";

      }, 300);

    }
  );


  // =====================
  // PDF INDIVIDUAL
  // =====================

  btnWORD.addEventListener(
    "click",
    (e) => {

      e.stopPropagation();


      const { jsPDF } =
        window.jspdf;


      const doc =
        new jsPDF();


      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(22);

      doc.text(
        "FACTURA",
        105,
        20,
        { align:"center" }
      );


      doc.line(
        20,
        28,
        190,
        28
      );


      doc.setFontSize(12);

      doc.setFont(
        "helvetica",
        "normal"
      );


      doc.text(
        `Proveedor: ${factura.proveedor}`,
        20,
        45
      );


      doc.text(
        `Factura: ${factura.numero_factura || "SIN N°"}`,
        20,
        55
      );


      doc.text(
        `Fecha: ${formatearFechaSimple(factura.fecha)}`,
        20,
        65
      );


      let y = 85;


      doc.setFont(
        "helvetica",
        "bold"
      );


      doc.text(
        "Producto",
        20,
        y
      );

      doc.text(
        "Cant.",
        120,
        y
      );

      doc.text(
        "Total",
        160,
        y
      );


      y += 5;


      doc.line(
        20,
        y,
        190,
        y
      );


      y += 10;


      doc.setFont(
        "helvetica",
        "normal"
      );


      factura.productos.forEach(p => {

        doc.text(
          String(p.nombre),
          20,
          y
        );


        doc.text(
          String(p.cantidad),
          125,
          y
        );


        doc.text(
          `$${formatearDinero(p.precio)}`,
          160,
          y
        );


        y += 10;

      });


      doc.line(
        20,
        y,
        190,
        y
      );


      y += 15;


      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(16);


      doc.text(
        `TOTAL: $${formatearDinero(factura.total)}`,
        20,
        y
      );


      doc.save(

        `Factura-${factura.numero_factura || factura.id}.pdf`

      );

    }
  );


  container.appendChild(card);

}


// =========================
// AGRUPAR POR DIA
// =========================

function agruparPorDia(
  facturas
){

  const grupos = {};


  facturas.forEach(f => {

    const fecha =
      new Date(f.fecha);


    const key =
      fecha.toLocaleDateString(
        "es-CL",
        {

          year:"numeric",

          month:"2-digit",

          day:"2-digit"

        }
      );


    if(!grupos[key]){

      grupos[key] = [];

    }


    grupos[key].push(f);

  });


  return grupos;

}


// =========================
// BUSCADOR SOLO FECHA
// =========================

buscador.addEventListener(
  "input",
  () => {

    const valor =
      buscador.value;


    // =====================
    // SI NO HAY FECHA
    // =====================

    if(valor === ""){

      cargarFacturas();

      return;

    }


    // =====================
    // FILTRAR FACTURAS
    // =====================

    const filtradas =
      facturasGlobal.filter(factura => {

        const fechaFactura =
          new Date(factura.fecha)
            .toISOString()
            .split("T")[0];


        return fechaFactura === valor;

      });


    // =====================
    // LIMPIAR
    // =====================

    container.innerHTML = "";


    // =====================
    // AGRUPAR
    // =====================

    const grupos =
      agruparPorDia(
        filtradas
      );


    Object.keys(grupos)
      .reverse()
      .forEach(semana => {

        let totalSemana = 0;


        grupos[semana]
          .forEach(factura => {

            totalSemana +=
              Number(
                factura.total || 0
              );

          });


        const titulo =
          document.createElement(
            "div"
          );

        titulo.classList.add(
          "semana-title"
        );


        titulo.innerHTML = `

          <div class="dia-header">

            <div>

              📅 ${semana}

            </div>

            <div class="total-semana">

              Total del Día:
              $${totalSemana.toLocaleString("es-CL")}

            </div>

            <button
              class="btn-pdf-dia"
              data-dia="${semana}"
            >

              📄 PDF Día

            </button>

          </div>

        `;


        container.appendChild(
          titulo
        );


        const btnPdfDia =
          titulo.querySelector(
            ".btn-pdf-dia"
          );


        btnPdfDia.addEventListener(
          "click",
          () => {

            exportarPDFDia(

              semana,

              grupos[semana]

            );

          }
        );


        grupos[semana]
          .forEach(factura => {

            renderFactura(
              factura
            );

          });

      });

  }
);


// =========================
// PDF DEL DIA
// =========================

function exportarPDFDia(

  dia,
  facturas

){

  const { jsPDF } =
    window.jspdf;


  const doc =
    new jsPDF();


  let y = 25;

  let totalDia = 0;


  // =====================
  // TITULO
  // =====================

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(20);

  doc.text(
    `FACTURAS DEL DÍA`,
    105,
    y,
    { align:"center" }
  );


  y += 10;


  doc.setFontSize(12);

  doc.text(
    dia,
    105,
    y,
    { align:"center" }
  );


  y += 15;


  // =====================
  // FACTURAS
  // =====================

  facturas.forEach(factura => {


    totalDia +=
      Number(
        factura.total || 0
      );


    const alturaFactura =

      70 +

      (factura.productos.length * 10);


    if(

      y + alturaFactura > 270

    ){

      doc.addPage();

      y = 20;

    }


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(14);

    doc.text(
      `Proveedor: ${factura.proveedor}`,
      20,
      y
    );


    y += 8;


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);


    doc.text(
      `Factura: ${factura.numero_factura || "SIN N°"}`,
      20,
      y
    );


    y += 7;


    doc.text(
      `Fecha: ${formatearFechaSimple(factura.fecha)}`,
      20,
      y
    );


    y += 10;


    doc.setFont(
      "helvetica",
      "bold"
    );


    doc.text(
      "Producto",
      20,
      y
    );

    doc.text(
      "Cant.",
      120,
      y
    );

    doc.text(
      "Total",
      160,
      y
    );


    y += 4;


    doc.line(
      20,
      y,
      190,
      y
    );


    y += 8;


    doc.setFont(
      "helvetica",
      "normal"
    );


    factura.productos.forEach(p => {

      doc.text(
        String(p.nombre),
        20,
        y
      );


      doc.text(
        String(p.cantidad),
        125,
        y
      );


      doc.text(
        `$${formatearDinero(p.precio)}`,
        160,
        y
      );


      y += 8;

    });


    doc.line(
      20,
      y,
      190,
      y
    );


    y += 10;


    doc.setFont(
      "helvetica",
      "bold"
    );


    doc.text(
      `TOTAL: $${formatearDinero(factura.total)}`,
      20,
      y
    );


    y += 20;

  });


  // =====================
  // TOTAL DEL DIA
  // =====================

  if(y > 240){

    doc.addPage();

    y = 20;

  }


  doc.line(
    20,
    y,
    190,
    y
  );


  y += 15;


  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(18);


  doc.text(
    "TOTAL DEL DÍA",
    105,
    y,
    { align:"center" }
  );


  y += 15;


  doc.setFontSize(22);


  doc.text(
    `$${formatearDinero(totalDia)}`,
    105,
    y,
    { align:"center" }
  );


  y += 10;


  doc.line(
    20,
    y,
    190,
    y
  );


  doc.save(

    `Facturas-${dia}.pdf`

  );

}


// =========================
// INIT
// =========================

cargarFacturas(true);