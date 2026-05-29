
// =====================================================
// CALENDARIO PROVEEDORES
// =====================================================

const calendario = {

  Lunes:[],
  Martes:[],
  Miércoles:[],
  Jueves:[],
  Viernes:[],
  Sábado:[]

};


// =========================
// BOTONES AGREGAR
// =========================

const botonesAgregarProveedor =
  document.querySelectorAll(
    ".btn-agregar-proveedor"
  );


// =========================
// ENTER PROVEEDORES
// =========================

const inputsProveedor =
  document.querySelectorAll(
    ".input-proveedor"
  );


inputsProveedor.forEach(input => {

  input.addEventListener(
    "keydown",
    (e) => {

      if(e.key === "Enter"){

        const dia =
          input.dataset.dia;


        agregarProveedor(dia);

      }

    }
  );

});


botonesAgregarProveedor
  .forEach(boton => {

    boton.addEventListener(
      "click",
      () => {

        const dia =
          boton.dataset.dia;


        agregarProveedor(dia);

      }
    );

  });


// =========================
// AGREGAR PROVEEDOR
// =========================

function agregarProveedor(dia){

  const input =
    document.querySelector(

      `.input-proveedor[data-dia="${dia}"]`

    );


  const texto =
    input.value.trim();


  if(texto === ""){

    showToast(
      "Escribe proveedor",
      "warning"
    );

    return;

  }


  calendario[dia].push(texto);


  input.value = "";


  renderCalendario();


}



// =========================
// RENDER CALENDARIO
// =========================

function renderCalendario(){

  Object.keys(calendario)
    .forEach(dia => {

      const container =
        document.getElementById(
          dia
        );


      container.innerHTML = "";


      calendario[dia]
        .forEach(
          (
            proveedor,
            index
          ) => {

            const card =
              document.createElement(
                "div"
              );


            card.classList.add(
              "proveedor-item"
            );


            card.innerHTML = `

              <span>

                ${proveedor}

              </span>


              <button
                class="btn-eliminar-proveedor"
              >

                ✕

              </button>

            `;


            const botonEliminar =
              card.querySelector(
                ".btn-eliminar-proveedor"
              );


            botonEliminar
              .addEventListener(
                "click",
                () => {

                  const confirmar =
                    confirm(
                      "¿Eliminar proveedor?"
                    );


                  if(!confirmar){
                    return;
                  }


                  calendario[dia]
                    .splice(
                      index,
                      1
                    );


                  renderCalendario();


                  showToast(
                    "Proveedor eliminado",
                    "success"
                  );


                }
              );


            container.appendChild(
              card
            );

          }
        );

    });

}


// =========================
// GUARDAR
// =========================

const guardarProveedoresBtn =
  document.getElementById(
    "guardarProveedoresBtn"
  );


guardarProveedoresBtn
  .addEventListener(
    "click",
    guardarCalendario
  );


async function guardarCalendario(){

  try{

    guardarProveedoresBtn.disabled =
      true;


    guardarProveedoresBtn.innerText =
      "Guardando...";


    await fetch(url, {

      method:"POST",

      mode:"cors",

      headers:{
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body:JSON.stringify({

        accion:
          "guardarCalendario",

        calendario

      })

    });


    guardarProveedoresBtn.innerText =
      "✓ Guardado";


    setTimeout(() => {

      guardarProveedoresBtn.disabled =
        false;


      guardarProveedoresBtn.innerText =
        "💾 Guardar Calendario";

    }, 1200);


  }catch(error){

    console.log(error);


    guardarProveedoresBtn.disabled =
      false;


    guardarProveedoresBtn.innerText =
      "💾 Guardar Calendario";


    showToast(
      "Error al guardar",
      "error"
    );

  }

}


// =====================================================
// CARGAR SOLO AL ENTRAR
// =====================================================

async function cargarCalendario(){

  try{

    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    const calendarioDB =
      datos.calendario || {};


    Object.keys(calendario)
      .forEach(dia => {

        calendario[dia] =
          calendarioDB[dia] || [];

      });


    renderCalendario();

  }catch(error){

    console.log(error);

  }

}


// =====================================================
// INIT
// =====================================================

cargarCalendario();