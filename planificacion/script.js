// =====================================================
// TABS
// =====================================================

const tabButtons =
  document.querySelectorAll(
    ".tab-btn"
  );


const tabContents =
  document.querySelectorAll(
    ".tab-content"
  );


tabButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

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
        .classList.add(
          "active"
        );

    }
  );

});


// =====================================================
// PENDIENTES
// =====================================================

let pendientes = [];


// =========================
// AUTO REFRESH
// =========================

let autoRefresh;


// =========================
// INICIAR AUTO REFRESH
// =========================

function iniciarAutoRefresh(){

  clearInterval(
    autoRefresh
  );


  autoRefresh =
    setInterval(() => {

      cargarPendientes();

    }, 15000);

}


// =========================
// ELEMENTOS
// =========================

const listaPendientes =
  document.getElementById(
    "listaPendientes"
  );


const estadoPendientes =
  document.getElementById(
    "estadoPendientes"
  );


const todoListoBtn =
  document.getElementById(
    "todoListoBtn"
  );




// =========================
// RENDER PENDIENTES
// =========================

function renderPendientes(){

  listaPendientes.innerHTML =
    "";


  if(
    pendientes.length === 0
  ){

    estadoPendientes.style.display =
      "block";


    estadoPendientes.innerHTML =
      "✅ No hay compras hoy";


    return;

  }


  estadoPendientes.style.display =
    "none";


  pendientes.forEach(
    pendiente => {

      const item =
        document.createElement(
          "div"
        );


      item.classList.add(
        "pendiente-item"
      );


      item.innerHTML = `

        <div class="pendiente-info">

          <div class="pendiente-texto">

            🛒 ${
              typeof pendiente === "object"
                ? pendiente.texto
                : pendiente
            }

          </div>

        </div>

      `;


      listaPendientes.appendChild(
        item
      );

    }
  );

}


// =========================
// TODO LISTO
// =========================

todoListoBtn.addEventListener(
  "click",
  vaciarPendientes
);


async function vaciarPendientes(){

  const confirmar =
    confirm(
      "¿Marcar todo como comprado y borrar pendientes?"
    );


  if(!confirmar){
    return;
  }


  try{

    // =====================
    // BLOQUEAR Y OSCURECER
    // =====================

    document.body.style.opacity =
      "0.6";


    document.body.style.pointerEvents =
      "none";


    todoListoBtn.disabled =
      true;


    todoListoBtn.innerText =
      "Limpiando...";


    await fetch(url, {

      method:"POST",

      mode:"cors",

      headers:{
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body:JSON.stringify({

        accion:
          "vaciarPendientes"

      })

    });


    pendientes = [];


    renderPendientes();


    showToast(
      "Pendientes eliminados",
      "success"
    );


    // =====================
    // REINICIAR CONTADOR
    // =====================

    iniciarAutoRefresh();


    // =====================
    // DESBLOQUEAR
    // =====================

    document.body.style.opacity =
      "1";


    document.body.style.pointerEvents =
      "auto";


    todoListoBtn.disabled =
      false;


    todoListoBtn.innerText =
      "✅ Todo Comprado";


  }catch(error){

    console.log(error);


    // =====================
    // DESBLOQUEAR
    // =====================

    document.body.style.opacity =
      "1";


    document.body.style.pointerEvents =
      "auto";


    todoListoBtn.disabled =
      false;


    todoListoBtn.innerText =
      "✅ Todo Comprado";


    showToast(
      "Error al limpiar",
      "error"
    );


    // =====================
    // REINTENTAR RAPIDO
    // =====================

    setTimeout(() => {

      vaciarPendientes();

    }, 3000);

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
// CARGAR PENDIENTES
// =====================================================

async function cargarPendientes(
  mostrarCarga = false
){

  try{

    if(mostrarCarga){

      estadoPendientes.style.display =
        "block";


      estadoPendientes.innerHTML =
        "⏳ Cargando pedidos...";

    }


    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    pendientes =
      datos.pendientes || [];


    renderPendientes();

  }catch(error){

    console.log(error);


    estadoPendientes.style.display =
      "block";


    estadoPendientes.innerHTML =
      "❌ Error al cargar pedidos";


    showToast(
      "Error al cargar datos",
      "error"
    );


    // =====================
    // REINTENTAR RAPIDO
    // =====================

    setTimeout(() => {

      cargarPendientes();

    }, 3000);

  }

}


// =====================================================
// INIT
// =====================================================

cargarPendientes(true);


// =========================
// INICIAR AUTO REFRESH
// =========================

iniciarAutoRefresh();