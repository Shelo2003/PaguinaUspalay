let facturaEditandoId = null;


// =========================
// TABS
// =========================

const tabButtons =
  document.querySelectorAll(".tab-btn");

const tabContents =
  document.querySelectorAll(".tab-content");


tabButtons.forEach(button => {

  button.addEventListener("click", () => {

    const target =
      button.dataset.tab;


    tabButtons.forEach(btn => {

      btn.classList.remove(
        "active"
      );

    });


    tabContents.forEach(content => {

      content.classList.remove(
        "active"
      );

    });


    button.classList.add(
      "active"
    );


    document
      .getElementById(target)
      .classList.add("active");

  });

});


// =========================
// ELEMENTOS
// =========================

const productosContainer =
  document.getElementById("productos-container");

const agregarProductoBtn =
  document.getElementById("agregar-producto");

const guardarFacturaBtn =
  document.getElementById("guardar-factura");

const totalTexto =
  document.getElementById("total");

const proveedorSelect =
  document.getElementById("proveedor");

const listaProveedores =
  document.getElementById("listaProveedores");

const agregarProveedorBtn =
  document.getElementById("agregarProveedorBtn");

const perteneceASelect =
  document.getElementById("perteneceA");

const notaTextarea =
  document.getElementById("nota");


// =========================
// PANTALLA CARGA
// =========================

function mostrarCargaInicial(){

  document.body.style.opacity =
    "0.5";

  document.body.style.pointerEvents =
    "none";


  const loading =
    document.createElement("div");

  loading.id =
    "pantalla-carga";


  loading.innerHTML = `

    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      color: white;
      font-size: 22px;
      font-weight: bold;
      backdrop-filter: blur(3px);
    ">

      ⏳ Cargando datos...

    </div>

  `;


  document.body.appendChild(
    loading
  );

}


// =========================
// OCULTAR CARGA
// =========================

function ocultarCargaInicial(){

  document.body.style.opacity =
    "1";

  document.body.style.pointerEvents =
    "auto";


  const loading =
    document.getElementById(
      "pantalla-carga"
    );


  if(loading){

    loading.remove();

  }

}


// =========================
// BLOQUEAR FACTURA
// =========================

function bloquearFormularioFactura(){

  guardarFacturaBtn.disabled =
    true;

  guardarFacturaBtn.innerText =
    facturaEditandoId
      ? "Actualizando..."
      : "Guardando...";


  guardarFacturaBtn.style.opacity =
    "0.6";


  agregarProductoBtn.disabled =
    true;

  agregarProductoBtn.style.opacity =
    "0.6";


  document
    .querySelectorAll(
      "input, select, textarea, button"
    )
    .forEach(elemento => {

      if(
        elemento.id !==
        "guardar-factura"
      ){

        elemento.disabled = true;

        elemento.style.opacity =
          "0.6";

      }

    });


  productosContainer.style.opacity =
    "0.6";

  productosContainer.style.pointerEvents =
    "none";

}


// =========================
// DESBLOQUEAR FACTURA
// =========================

function desbloquearFormularioFactura(){

  guardarFacturaBtn.disabled =
    false;

  guardarFacturaBtn.innerText =
    facturaEditandoId
      ? "Actualizar Factura"
      : "Guardar Factura";


  guardarFacturaBtn.style.opacity =
    "1";


  agregarProductoBtn.disabled =
    false;

  agregarProductoBtn.style.opacity =
    "1";


  document
    .querySelectorAll(
      "input, select, textarea, button"
    )
    .forEach(elemento => {

      elemento.disabled = false;

      elemento.style.opacity =
        "1";

    });


  productosContainer.style.opacity =
    "1";

  productosContainer.style.pointerEvents =
    "auto";

}


// =========================
// CARGAR PROVEEDORES
// =========================

async function cargarProveedores(){

  try{

    const respuesta =
      await fetch(url);

    const datos =
      await respuesta.json();


    // =========================
    // PROVEEDORES
    // =========================

    proveedorSelect.innerHTML = `

      <option value="">
        Seleccionar proveedor
      </option>

    `;


    listaProveedores.innerHTML = "";


    (datos.proveedores || [])
      .forEach(proveedor => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          proveedor;

        option.textContent =
          proveedor;

        proveedorSelect.appendChild(
          option
        );


        const div =
          document.createElement(
            "div"
          );

        div.classList.add(
          "categoria-item"
        );

        div.textContent =
          proveedor;

        listaProveedores.appendChild(
          div
        );

      });


    // =========================
    // PERSONAS
    // =========================

    perteneceASelect.innerHTML = `

      <option value="">
        Seleccionar persona
      </option>

    `;


    (datos.personas || [])
      .forEach(persona => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          persona;

        option.textContent =
          persona;

        perteneceASelect.appendChild(
          option
        );

      });

  }catch(error){

    console.log(error);

    showToast(
      "Error cargando datos",
      "error"
    );

  }

}


// =========================
// AGREGAR PROVEEDOR
// =========================

agregarProveedorBtn
  .addEventListener(
    "click",
    async () => {

      agregarProveedorBtn.disabled = true;

      agregarProveedorBtn.innerText =
        "Guardando...";


      document
        .getElementById(
          "nuevoProveedor"
        )
        .disabled = true;


      document
        .getElementById(
          "nuevoProveedor"
        )
        .style.opacity = "0.6";


      const nombre =
        document
          .getElementById(
            "nuevoProveedor"
          )
          .value
          .trim();


      if(nombre === ""){

        showToast(
          "Ingrese proveedor",
          "warning"
        );


        agregarProveedorBtn.disabled =
          false;

        agregarProveedorBtn.innerText =
          "Agregar Proveedor";


        document
          .getElementById(
            "nuevoProveedor"
          )
          .disabled = false;


        document
          .getElementById(
            "nuevoProveedor"
          )
          .style.opacity = "1";

        return;

      }


      try{

        const respuesta =
          await fetch(url, {

            method:"POST",

            body:JSON.stringify({

              accion:
                "agregarProveedor",

              nombre

            })

          });


        const resultado =
          await respuesta.json();


        if(resultado.success){

          showToast(
            "Proveedor agregado",
            "success"
          );


          document
            .getElementById(
              "nuevoProveedor"
            )
            .value = "";


          cargarProveedores();

        }else{

          showToast(
            resultado.mensaje,
            "warning"
          );

        }

      }catch(error){

        console.log(error);

      }


      agregarProveedorBtn.disabled =
        false;

      agregarProveedorBtn.innerText =
        "Agregar Proveedor";


      document
        .getElementById(
          "nuevoProveedor"
        )
        .disabled = false;


      document
        .getElementById(
          "nuevoProveedor"
        )
        .style.opacity = "1";

    }
  );


// =========================
// CREAR FILA PRODUCTO
// =========================

function crearFilaProducto(

  nombre = "",
  cantidad = "",
  precio = ""

){

  const div =
    document.createElement("div");

  div.classList.add("producto");


  div.innerHTML = `

    <input
      type="text"
      placeholder="Nombre Producto"
      class="nombre"
      value="${nombre}"
    >

    <input
      type="text"
      placeholder="Cantidad"
      class="cantidad"
      value="${cantidad}"
    >

    <input
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      placeholder="Total Producto"
      class="precio"
      value="${precio}"
    >

    <button class="eliminar">
      X
    </button>

  `;


  productosContainer.appendChild(div);

  div
    .querySelectorAll(
      '.precio'
    )
    .forEach(input => {

      input.addEventListener(
        "input",
        () => {

          input.value =
            input.value.replace(
              /\D/g,
              ""
            );

        }
      );

    });







  div.querySelector(".eliminar")
    .addEventListener("click", () => {

      div.remove();

      calcularTotal();

      showToast(
        "Producto eliminado",
        "warning"
      );

    });


  div.querySelector(".precio")
    .addEventListener(
      "input",
      calcularTotal
    );

}


// =========================
// AGREGAR PRODUCTO
// =========================

agregarProductoBtn
  .addEventListener("click", () => {

    crearFilaProducto();

  });


// PRIMERA FILA

crearFilaProducto();


// =========================
// CALCULAR TOTAL
// =========================

function calcularTotal(){

  let total = 0;


  const productos =
    document.querySelectorAll(".producto");


  productos.forEach(producto => {

    const precio =
      Number(

        producto
          .querySelector(".precio")
          .value

      ) || 0;


    total += precio;

  });


  totalTexto.textContent =
    `Total: $${total.toLocaleString("es-CL")}`;

}


// =========================
// GUARDAR FACTURA
// =========================

guardarFacturaBtn
  .addEventListener(
    "click",
    async () => {

      bloquearFormularioFactura();


      const proveedor =
        document
          .getElementById("proveedor")
          .value;

      const perteneceA =
        document
          .getElementById("perteneceA")
          .value;

      const nota =
        document
          .getElementById("nota")
          .value;

      const numero_factura =
        document
          .getElementById("numero_factura")
          .value;

      const fecha =
        document
          .getElementById("fecha")
          .value;


      const productosHTML =
        document
          .querySelectorAll(".producto");


      // =========================
      // VALIDAR CAMPOS
      // =========================

      if(!proveedor.trim()){

        showToast(
          "Seleccione proveedor",
          "error"
        );

        desbloquearFormularioFactura();

        return;

      }


      if(!perteneceA.trim()){

        showToast(
          "Seleccione persona",
          "error"
        );

        desbloquearFormularioFactura();

        return;

      }


      if(!numero_factura.trim()){

        showToast(
          "Ingrese número de factura",
          "error"
        );

        desbloquearFormularioFactura();

        return;

      }


      if(!fecha.trim()){

        showToast(
          "Seleccione fecha",
          "error"
        );

        desbloquearFormularioFactura();

        return;

      }


      const tieneProductoValido =
        Array.from(productosHTML)
          .some(producto => {

            const nombre =
              producto
                .querySelector(".nombre")
                .value
                .trim();

            const precio =
              producto
                .querySelector(".precio")
                .value
                .trim();

            return (
              nombre !== "" ||
              precio !== ""
            );

          });


      if(!tieneProductoValido){

        showToast(
          "Agregue al menos 1 producto",
          "error"
        );

        desbloquearFormularioFactura();

        return;

      }


      const productos = [];


      let total = 0;


      productosHTML.forEach(producto => {

        const nombre =
          producto
            .querySelector(".nombre")
            .value;


        const cantidad =
          producto
            .querySelector(".cantidad")
            .value;


        const precio =
          Number(

            producto
              .querySelector(".precio")
              .value

          );


        total += precio;


        productos.push({

          nombre,
          cantidad,
          precio

        });

      });


      const datos = {

        accion: facturaEditandoId
          ? "editarFactura"
          : "guardarFactura",

        id: facturaEditandoId,

        proveedor,
        perteneceA,
        nota,
        numero_factura,
        fecha,
        productos,
        total

      };


      try{

        const respuesta =
          await fetch(url, {

            method: "POST",

            body: JSON.stringify(datos)

          });


        const resultado =
          await respuesta.json();


        if(resultado.success){

          showToast(

            facturaEditandoId
              ? "Factura actualizada"
              : "Factura guardada",

            "success"

          );


          setTimeout(() => {

            location.reload();

          }, 1000);

        }else{

          showToast(
            "Error al guardar",
            "error"
          );

        }

      }catch(error){

        console.log(error);

        showToast(
          "Error conexión",
          "error"
        );

      }


      desbloquearFormularioFactura();

    }
  );


// =========================
// CARGAR FACTURA EDITAR
// =========================

window.cargarFacturaParaEditar =
function(factura){

  facturaEditandoId =
    factura.id;


  document
    .getElementById("proveedor")
    .value =
      factura.proveedor;


  document
    .getElementById("perteneceA")
    .value =
      factura.perteneceA || "";


  document
    .getElementById("nota")
    .value =
      factura.nota || "";


  document
    .getElementById("fecha")
    .value =
      factura.fecha;


  document
    .getElementById("numero_factura")
    .value =
      factura.numero_factura || "";


  productosContainer.innerHTML = "";


  factura.productos.forEach(p => {

    crearFilaProducto(

      p.nombre,
      p.cantidad,
      p.precio

    );

  });


  calcularTotal();


  guardarFacturaBtn.textContent =
    "Actualizar Factura";


  showToast(
    "Editando factura",
    "warning"
  );

};


// =========================
// SI VIENE EDITAR
// =========================

window.addEventListener("load", async () => {

  mostrarCargaInicial();


  await cargarProveedores();


  const data =
    localStorage.getItem(
      "facturaEditar"
    );


  if(data){

    const factura =
      JSON.parse(data);


    cargarFacturaParaEditar(
      factura
    );


    localStorage.removeItem(
      "facturaEditar"
    );

  }


  ocultarCargaInicial();

});




