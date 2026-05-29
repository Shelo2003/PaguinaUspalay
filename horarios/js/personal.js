// =========================
// LISTA
// =========================

const listaPersonal =
  document.getElementById(
    "listaPersonal"
  );


// =========================
// CARGAR PERSONAL
// =========================

async function cargarPersonal(){

  try{

    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    const personal =
      datos.personal || [];


    listaPersonal.innerHTML = "";


    personal.forEach(persona => {

      const div =
        document.createElement(
          "div"
        );


      div.classList.add(
        "persona-card"
      );


      div.innerHTML = `

        <span>

          ${persona.nombre}

        </span>


        <button
          class="btn-eliminar"
        >

          −

        </button>

      `;


      listaPersonal.appendChild(
        div
      );


      // =====================
      // BOTON ELIMINAR
      // =====================

      const botonEliminar =
        div.querySelector(
          ".btn-eliminar"
        );


      botonEliminar.addEventListener(
        "click",
        () => {

          eliminarPersona(

            persona.id,

            botonEliminar

          );

        }
      );

    });

  }catch(error){

    console.log(error);

  }

}


// =========================
// AGREGAR PERSONA
// =========================

document
  .getElementById(
    "agregarPersonaBtn"
  )
  .addEventListener(
    "click",
    agregarPersona
  );


async function agregarPersona(){

  const input =
    document.getElementById(
      "nombrePersona"
    );


  const boton =
    document.getElementById(
      "agregarPersonaBtn"
    );


  const nombre =
    input.value.trim();


  if(!nombre){

    showToast(
      "Ingresa un nombre",
      "warning"
    );

    return;

  }


  try{

    // =====================
    // BLOQUEAR BOTON
    // =====================

    boton.disabled = true;


    boton.innerText =
      "Agregando...";


    // =====================
    // FETCH
    // =====================

    await fetch(url, {

      method:"POST",

      mode:"cors",

      headers:{
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body:JSON.stringify({

        accion:"agregarPersona",

        nombre

      })

    });


    // =====================
    // LIMPIAR
    // =====================

    input.value = "";


    // =====================
    // RECARGAR
    // =====================

    await cargarPersonal();


    // =====================
    // EXITO
    // =====================

    boton.innerText =
      "Agregado ✓";


    setTimeout(() => {

      boton.disabled = false;


      boton.innerText =
        "Agregar Persona";

    }, 1200);


  }catch(error){

    console.log(error);


    boton.innerText =
      "Error";


    setTimeout(() => {

      boton.disabled = false;


      boton.innerText =
        "Agregar Persona";

    }, 1500);

  }

}


// =========================
// ELIMINAR PERSONA
// =========================

async function eliminarPersona(
  id,
  boton
){

  try{

    // =====================
    // BLOQUEAR
    // =====================

    boton.disabled = true;


    boton.innerText =
      "...";


    // =====================
    // FETCH
    // =====================

    await fetch(url, {

      method:"POST",

      mode:"cors",

      headers:{
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body:JSON.stringify({

        accion:"eliminarPersona",

        id

      })

    });


    // =====================
    // RECARGAR
    // =====================

    await cargarPersonal();


  }catch(error){

    console.log(error);


    boton.disabled = false;


    boton.innerText =
      "−";

  }

}


// =========================
// INIT
// =========================

cargarPersonal();