// =====================================================
// ELEMENTOS
// =====================================================

const listaPendientes =
  document.getElementById(
    "listaPendientes"
  );


const pedidosGuardados =
  document.getElementById(
    "pedidosGuardados"
  );


const agregarBtn =
  document.getElementById(
    "agregarBtn"
  );


const enviarBtn =
  document.getElementById(
    "enviarBtn"
  );


const btnRefrescar =
  document.getElementById(
    "btnRefrescar"
  );


// =====================================================
// AGREGAR INPUT
// =====================================================

agregarBtn.addEventListener(
  "click",
  agregarInput
);


function agregarInput(){

  const div =
    document.createElement(
      "div"
    );


  div.classList.add(
    "pendiente-item"
  );


  div.innerHTML = `

    <input
      type="text"
      class="input-pendiente"
      placeholder="Escribe un pendiente..."
    >


    <button
      class="btn-eliminar"
      onclick="eliminarInput(this)"
    >

      ✕

    </button>

  `;


  listaPendientes.appendChild(
    div
  );

}


// =====================================================
// ELIMINAR INPUT
// =====================================================

function eliminarInput(boton){

  const items =
    document.querySelectorAll(
      ".pendiente-item"
    );


  // =====================
  // DEJAR MINIMO 1
  // =====================

  if(items.length === 1){

    return;

  }


  // =====================
  // CONFIRMAR
  // =====================

  const confirmar =
    confirm(
      "¿Seguro que quieres eliminar este pendiente?"
    );


  if(!confirmar){

    return;

  }


  boton.parentElement.remove();

}


// =====================================================
// ENVIAR
// =====================================================

enviarBtn.addEventListener(
  "click",
  enviarPendientes
);


// =====================================================
// REFRESCAR
// =====================================================

btnRefrescar.addEventListener(
  "click",
  async () => {

    try{

      // =====================
      // BLOQUEAR TODO
      // =====================

      document.body.style.opacity =
        "0.6";


      document.body.style.pointerEvents =
        "none";


      // =====================
      // BOTON
      // =====================

      btnRefrescar.disabled =
        true;


      btnRefrescar.innerText =
        "⟳";


      // =====================
      // MENSAJE
      // =====================

      showToast(
        "Recargando pendientes...",
        "success"
      );


      // =====================
      // RECARGAR
      // =====================

      await cargarPendientes();


      // =====================
      // EXITO
      // =====================

      showToast(
        "Pendientes actualizados",
        "success"
      );


    }catch(error){

      console.log(error);


      showToast(
        "Error al actualizar",
        "error"
      );

    }


    // =====================
    // DESBLOQUEAR
    // =====================

    document.body.style.opacity =
      "1";


    document.body.style.pointerEvents =
      "auto";


    btnRefrescar.disabled =
      false;


    btnRefrescar.innerText =
      "↻";

  }
);


// =====================================================
// ENVIAR PENDIENTES
// =====================================================

async function enviarPendientes(){

  const inputs =
    document.querySelectorAll(
      ".input-pendiente"
    );


  const pendientes = [];


  inputs.forEach(input => {

    const texto =
      input.value.trim();


    if(texto !== ""){

      pendientes.push(
        texto
      );

    }

  });


  // =====================
  // VALIDAR
  // =====================

  if(
    pendientes.length === 0
  ){

    showToast(
      "Escribe pendientes",
      "warning"
    );

    return;

  }


  try{

    // =====================
    // OSCURECER Y BLOQUEAR
    // =====================

    document.body.style.opacity =
      "0.6";


    document.body.style.pointerEvents =
      "none";


    // =====================
    // BLOQUEAR BOTON
    // =====================

    enviarBtn.disabled = true;


    enviarBtn.innerText =
      "Enviando...";


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

        accion:
          "agregarPendiente",

        pendientes

      })

    });


    // =====================
    // LIMPIAR INPUTS
    // =====================

    listaPendientes.innerHTML = `

      <div class="pendiente-item">

        <input
          type="text"
          class="input-pendiente"
          placeholder="Ej: Falta Coca Cola..."
        >


        <button
          class="btn-eliminar"
          onclick="eliminarInput(this)"
        >

          ✕

        </button>

      </div>

    `;


    // =====================
    // RECARGAR LISTA
    // =====================

    await cargarPendientes();


    // =====================
    // EXITO
    // =====================

    enviarBtn.innerText =
      "Enviado ✓";


    showToast(
      "Pendientes enviados",
      "success"
    );


    setTimeout(() => {

      // =====================
      // DESBLOQUEAR
      // =====================

      document.body.style.opacity =
        "1";


      document.body.style.pointerEvents =
        "auto";


      enviarBtn.disabled =
        false;


      enviarBtn.innerText =
        "Enviar Pendientes";

    }, 1200);


  }catch(error){

    console.log(error);


    // =====================
    // DESBLOQUEAR
    // =====================

    document.body.style.opacity =
      "1";


    document.body.style.pointerEvents =
      "auto";


    enviarBtn.disabled =
      false;


    enviarBtn.innerText =
      "Enviar Pendientes";


    showToast(
      "Error al enviar",
      "error"
    );

  }

}


// =====================================================
// CARGAR PENDIENTES
// =====================================================

async function cargarPendientes(){

  try{

    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    const pendientes =
      datos.pendientes || [];


    renderPendientes(
      pendientes
    );

  }catch(error){

    console.log(error);

  }

}


// =====================================================
// RENDER PENDIENTES
// =====================================================

function renderPendientes(
  pendientes
){

  pedidosGuardados.innerHTML =
    "";


  // =====================
  // VACIO
  // =====================

  if(
    pendientes.length === 0
  ){

    pedidosGuardados.innerHTML = `

      <div class="sin-pedidos">

        ✅ No hay pendientes

      </div>

    `;

    return;

  }


  // =====================
  // MOSTRAR
  // =====================

  pendientes.forEach(
    (
      pendiente,
      index
    ) => {

      const item =
        document.createElement(
          "div"
        );


      item.classList.add(
        "pedido-guardado"
      );


      item.innerHTML = `

        <span>

          🛒 ${
            typeof pendiente === "object"
              ? pendiente.texto
              : pendiente
          }

        </span>


        <button
          class="btn-borrar-pedido"
          onclick="eliminarPendiente(this, ${index})"
        >

          Eliminar

        </button>

      `;


      pedidosGuardados.appendChild(
        item
      );

    }
  );

}


// =====================================================
// ELIMINAR PENDIENTE
// =====================================================

async function eliminarPendiente(
  boton,
  index
){

  // =====================
  // CONFIRMAR
  // =====================

  const confirmar =
    confirm(
      "¿Seguro que quieres eliminar este pendiente?"
    );


  if(!confirmar){

    return;

  }


  try{

    // =====================
    // OSCURECER Y BLOQUEAR
    // =====================

    document.body.style.opacity =
      "0.6";


    document.body.style.pointerEvents =
      "none";


    // =====================
    // BLOQUEAR BOTON
    // =====================

    boton.disabled = true;


    boton.innerText =
      "Eliminando...";


    await fetch(url, {

      method:"POST",

      mode:"cors",

      headers:{
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body:JSON.stringify({

        accion:
          "eliminarPendiente",

        index

      })

    });


    showToast(
      "Pendiente eliminado",
      "success"
    );


    await cargarPendientes();


    // =====================
    // DESBLOQUEAR
    // =====================

    document.body.style.opacity =
      "1";


    document.body.style.pointerEvents =
      "auto";


  }catch(error){

    console.log(error);


    // =====================
    // DESBLOQUEAR
    // =====================

    document.body.style.opacity =
      "1";


    document.body.style.pointerEvents =
      "auto";


    boton.disabled =
      false;


    boton.innerText =
      "Eliminar";


    showToast(
      "Error al eliminar",
      "error"
    );

  }

}


// =====================================================
// TOAST
// =====================================================

function showToast(
  mensaje,
  tipo = "success"
){

  const toast =
    document.getElementById(
      "toast"
    );


  toast.innerText =
    mensaje;


  toast.className =
    `toast show ${tipo}`;


  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

  }, 2500);

}


// =====================================================
// INIT
// =====================================================

cargarPendientes();