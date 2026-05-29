let boletaEditandoId = null;


const productosContainer =
  document.getElementById(
    "productos-container"
  );

const agregarProductoBtn =
  document.getElementById(
    "agregar-producto"
  );

const guardarBoletaBtn =
  document.getElementById(
    "guardar-boleta"
  );

const totalTexto =
  document.getElementById(
    "total"
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

  div.classList.add(
    "producto"
  );


  div.innerHTML = `

    <input
      type="text"
      placeholder="Nombre Producto"
      class="nombre"
      value="${nombre}"
    >

    <input
      type="number"
      placeholder="Cantidad"
      class="cantidad"
      value="${cantidad}"
    >

    <input
      type="number"
      placeholder="Total Producto"
      class="precio"
      value="${precio}"
    >

    <button class="eliminar">
      X
    </button>

  `;


  productosContainer.appendChild(
    div
  );


  div.querySelector(".eliminar")
    .addEventListener(
      "click",
      () => {

        div.remove();

        calcularTotal();

      }
    );


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
  .addEventListener(
    "click",
    () => {

      crearFilaProducto();

    }
  );


// FILA INICIAL

crearFilaProducto();


// =========================
// CALCULAR TOTAL
// =========================

function calcularTotal(){

  let total = 0;


  const productos =
    document.querySelectorAll(
      ".producto"
    );


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
// GUARDAR BOLETA
// =========================

guardarBoletaBtn
  .addEventListener(
    "click",
    async () => {


      // =====================
      // BLOQUEAR FORMULARIO
      // =====================

      document.body.style.opacity =
        "0.6";


      document.body.style.pointerEvents =
        "none";


      guardarBoletaBtn.disabled =
        true;


      guardarBoletaBtn.innerText =

        boletaEditandoId
          ? "Actualizando..."
          : "Guardando...";


      const lugar_compra =
        document
          .getElementById(
            "lugar_compra"
          )
          .value;


      const numero_boleta =
        document
          .getElementById(
            "numero_boleta"
          )
          .value;


      const fecha =
        document
          .getElementById(
            "fecha"
          )
          .value;


      const productosHTML =
        document
          .querySelectorAll(
            ".producto"
          );


      const productos = [];


      let total = 0;


      productosHTML.forEach(producto => {

        const nombre =
          producto
            .querySelector(".nombre")
            .value;


        const cantidad =
          Number(

            producto
              .querySelector(".cantidad")
              .value

          );


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

        accion: boletaEditandoId
          ? "editarBoleta"
          : "guardarBoleta",

        id: boletaEditandoId,

        lugar_compra,
        numero_boleta,
        fecha,
        productos,
        total

      };


      try{

        const respuesta =
          await fetch(url, {

            method:"POST",

            body:JSON.stringify(
              datos
            )

          });


        const resultado =
          await respuesta.json();


        if(resultado.success){

          showToast(

            boletaEditandoId
              ? "Boleta actualizada"
              : "Boleta guardada",

            "success"

          );


          setTimeout(() => {

            location.reload();

          }, 1000);

        }

      }catch(error){

        console.log(error);

      }


      // =====================
      // DESBLOQUEAR
      // =====================

      document.body.style.opacity =
        "1";


      document.body.style.pointerEvents =
        "auto";


      guardarBoletaBtn.disabled =
        false;


      guardarBoletaBtn.innerText =

        boletaEditandoId
          ? "Actualizar Boleta"
          : "Guardar Boleta";

    }
  );


// =========================
// EDITAR
// =========================

function cargarBoletaEditar(
  boleta
){

  boletaEditandoId =
    boleta.id;


  document
    .getElementById(
      "lugar_compra"
    )
    .value =
      boleta.lugar_compra;


  document
    .getElementById(
      "numero_boleta"
    )
    .value =
      boleta.numero_boleta;


  document
    .getElementById(
      "fecha"
    )
    .value =

      new Date(
        boleta.fecha
      )
      .toISOString()
      .split("T")[0];


  productosContainer.innerHTML = "";


  boleta.productos.forEach(p => {

    crearFilaProducto(

      p.nombre,
      p.cantidad,
      p.precio

    );

  });


  calcularTotal();


  guardarBoletaBtn.textContent =
    "Actualizar Boleta";

}


// =========================
// SI VIENE EDITAR
// =========================

window.addEventListener(
  "load",
  () => {

    const data =
      localStorage.getItem(
        "boletaEditar"
      );


    if(!data) return;


    const boleta =
      JSON.parse(data);


    cargarBoletaEditar(
      boleta
    );


    localStorage.removeItem(
      "boletaEditar"
    );

  }
);