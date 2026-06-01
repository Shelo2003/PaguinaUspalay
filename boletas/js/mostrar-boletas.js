const container =
  document.getElementById(
    "boletas-container"
  );

const buscador =
  document.getElementById(
    "buscar"
  );

let boletasGlobal = [];


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
// CARGAR
// =========================

async function cargarBoletas(
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

          ⏳ Cargando boletas...

        </div>

      `;

    }


    const respuesta =
      await fetch(url);

    const datos =
      await respuesta.json();


    let boletas =
      datos.boletas || [];


    boletasGlobal =
      boletas;


    // =====================
    // ORDEN FECHA NUEVA
    // =====================

    boletas.sort((a,b) => {

      return new Date(b.fecha)
        - new Date(a.fecha);

    });


    container.innerHTML = "";


    // =====================
    // AGRUPAR POR DIA
    // =====================

    const grupos = {};


    boletas.forEach(boleta => {

      const fecha =
        formatearFecha(
          boleta.fecha
        );


      if(!grupos[fecha]){

        grupos[fecha] = [];

      }


      grupos[fecha].push(
        boleta
      );

    });


    // =====================
    // MOSTRAR
    // =====================

    Object.keys(grupos)
      .forEach(fecha => {


        // =====================
        // TOTAL DIA
        // =====================

        let totalDia = 0;


        grupos[fecha]
          .forEach(boleta => {

            totalDia +=
              Number(
                boleta.total || 0
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

              📅 ${fecha}

            </div>

            <div class="total-semana">

              Total del Día:
              $${totalDia.toLocaleString("es-CL")}

            </div>

            <button
              class="btn-pdf-dia"
            >

              📄 PDF Día

            </button>

          </div>

        `;


        container.appendChild(
          titulo
        );


        // =====================
        // PDF DIA
        // =====================

        titulo.querySelector(
          ".btn-pdf-dia"
        ).addEventListener(
          "click",
          () => {

            exportarPDFDia(

              fecha,

              grupos[fecha]

            );

          }
        );


        grupos[fecha]
          .forEach(boleta => {

            renderBoleta(
              boleta
            );

          });

      });

  }catch(error){

    console.log(error);

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
// FORMATEAR FECHA
// =========================

function formatearFecha(fecha){

  return new Date(fecha)
    .toLocaleDateString(
      "es-CL"
    );

}


// =========================
// RENDER
// =========================

function renderBoleta(
  boleta
){

  const card =
    document.createElement(
      "div"
    );

  card.classList.add(
    "factura-card"
  );


  let productosHTML = "";


  boleta.productos.forEach(p => {

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

        <strong>Boleta:</strong>

        ${boleta.numero_boleta}

      </div>


      <div>

        <strong>Lugar:</strong>

        ${boleta.lugar_compra}

      </div>


      <div>

        <strong>Fecha:</strong>

        ${formatearFecha(
          boleta.fecha
        )}

      </div>


      <div style="display:flex; gap:10px;">

        <button class="btn-editar">

          Editar

        </button>


        <button class="btn-eliminar">

          Eliminar

        </button>


        <button class="btn-pdf">

          PDF

        </button>

      </div>

    </div>


    <div class="factura-detalle">

      <table>

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
          boleta.total
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


  const btnPDF =
    card.querySelector(
      ".btn-pdf"
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
          "¿Eliminar boleta?"
        )
      ) return;


      try{

        bloquearAcciones(
          "Eliminando boleta..."
        );


        btnEliminar.innerText =
          "Eliminando...";


        await fetch(url, {

          method:"POST",

          body:JSON.stringify({

            accion:"eliminarBoleta",

            id:boleta.id

          })

        });


        await cargarBoletas();


        showToast(
          "Boleta eliminada",
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


      // =====================
      // BLOQUEAR
      // =====================

      document.body.style.opacity =
        "0.6";


      document.body.style.pointerEvents =
        "none";


      btnEditar.disabled =
        true;


      btnEditar.innerText =
        "Cargando...";


      // =====================
      // FECHA CORREGIDA
      // =====================

      const boletaCorregida = {

        ...boleta,

        fecha:
          new Date(boleta.fecha)
            .toISOString()
            .split("T")[0]

      };


      localStorage.setItem(

        "boletaEditar",

        JSON.stringify(
          boletaCorregida
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

  btnPDF.addEventListener(
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
        "BOLETA",
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
        `Lugar: ${boleta.lugar_compra}`,
        20,
        45
      );


      doc.text(
        `Boleta: ${boleta.numero_boleta}`,
        20,
        55
      );


      doc.text(
        `Fecha: ${formatearFecha(boleta.fecha)}`,
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


      boleta.productos.forEach(p => {

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
        `TOTAL: $${formatearDinero(boleta.total)}`,
        20,
        y
      );


      doc.save(
        `Boleta-${boleta.numero_boleta}.pdf`
      );

    }
  );


  container.appendChild(card);

}


// =========================
// PDF DIA
// =========================

function exportarPDFDia(

  fecha,
  boletas

){

  const { jsPDF } =
    window.jspdf;


  const doc =
    new jsPDF();


  let y = 25;

  let totalDia = 0;


  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(20);

  doc.text(
    `BOLETAS DEL DÍA`,
    105,
    y,
    { align:"center" }
  );


  y += 10;


  doc.setFontSize(12);

  doc.text(
    fecha,
    105,
    y,
    { align:"center" }
  );


  y += 15;


  boletas.forEach(boleta => {


    totalDia +=
      Number(
        boleta.total || 0
      );


    // =====================
    // EVITAR CORTES
    // =====================

    const alturaBoleta =

      70 +

      (boleta.productos.length * 10);


    if(

      y + alturaBoleta > 270

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
      `Lugar: ${boleta.lugar_compra}`,
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
      `Boleta: ${boleta.numero_boleta}`,
      20,
      y
    );


    y += 7;


    doc.text(
      `Fecha: ${formatearFecha(boleta.fecha)}`,
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


    boleta.productos.forEach(p => {

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
      `TOTAL: $${formatearDinero(boleta.total)}`,
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


  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(18);


  doc.line(
    20,
    y,
    190,
    y
  );


  y += 15;


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
    `Boletas-${fecha}.pdf`
  );

}


// =========================
// BUSCADOR
// =========================

buscador.addEventListener(
  "input",
  () => {

    const valor =
      buscador.value
        .toLowerCase();


    document
      .querySelectorAll(
        ".factura-card"
      )
      .forEach(card => {

        card.style.display =

          card.textContent
            .toLowerCase()
            .includes(valor)

            ? "block"
            : "none";

      });

  }
);


// =========================
// INIT
// =========================

cargarBoletas(true);