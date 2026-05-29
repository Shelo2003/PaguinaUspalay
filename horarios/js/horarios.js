// =========================
// COLUMNAS DIA
// =========================

const columnasDia = {

  Martes:[""],
  Miércoles:[""],
  Jueves:[""],
  Viernes:[""],
  Sábado:[""],
  Domingo:[""]

};


// =========================
// COLUMNAS NOCHE
// =========================

const columnasNoche = {

  Martes:[""],
  Miércoles:[""],
  Jueves:[""],
  Viernes:[""],
  Sábado:[""],
  Domingo:[""]

};


// =========================
// PERSONAL
// =========================

let personal = [];


// =========================
// CARGAR DATOS
// =========================

async function cargarDatos(){

  try{

    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    personal =
      datos.personal || [];


    if(datos.columnasDia){

      Object.keys(columnasDia)
        .forEach(dia => {

          columnasDia[dia] =
            datos.columnasDia[dia]
            || [""];

        });

    }


    if(datos.columnasNoche){

      Object.keys(columnasNoche)
        .forEach(dia => {

          columnasNoche[dia] =
            datos.columnasNoche[dia]
            || [""];

        });

    }


    renderHorario();

  }catch(error){

    console.log(
      "Error cargando:",
      error
    );

  }

}


// =========================
// RENDER
// =========================

function renderHorario(){

  renderTabla(
    columnasDia,
    "dia"
  );


  renderTabla(
    columnasNoche,
    "noche"
  );


  actualizarResumen();

}


// =========================
// RENDER TABLA
// =========================

function renderTabla(
  columnas,
  tipo
){

  Object.keys(columnas)
    .forEach(dia => {

      const contenedor =
        document.getElementById(
          `${tipo}-${dia}`
        );


      contenedor.innerHTML = "";


      columnas[dia]
        .forEach((nombre,index) => {

          crearFila(

            contenedor,

            tipo,

            dia,

            index,

            nombre

          );

        });

    });

}


// =========================
// CREAR FILA
// =========================

function crearFila(

  contenedor,

  tipo,

  dia,

  index,

  nombre = ""

){

  const row =
    document.createElement(
      "div"
    );


  row.classList.add(
    "persona-row"
  );


  let options = `

    <option value="">
      --
    </option>

  `;


  personal.forEach(persona => {

    options += `

      <option
        value="${persona.nombre}"
        ${nombre === persona.nombre ? "selected" : ""}
      >

        ${persona.nombre}

      </option>

    `;

  });


  row.innerHTML = `

    <select class="select-persona">

      ${options}

    </select>


    <button class="btn-eliminar">

      −

    </button>

  `;


  contenedor.appendChild(
    row
  );


  // =====================
  // SELECT
  // =====================

  const select =
    row.querySelector(
      ".select-persona"
    );


  select.addEventListener(
    "change",
    (e) => {

      cambiarPersona(

        tipo,

        dia,

        index,

        e.target.value

      );

    }
  );


  // =====================
  // ELIMINAR
  // =====================

  const btnEliminar =
    row.querySelector(
      ".btn-eliminar"
    );


  btnEliminar.addEventListener(
    "click",
    () => {

      eliminarPersona(

        tipo,

        dia,

        index

      );

    }
  );

}


// =========================
// OBTENER TABLA
// =========================

function obtenerTabla(tipo){

  return tipo === "dia"

    ? columnasDia

    : columnasNoche;

}


// =========================
// CAMBIAR PERSONA
// =========================

function cambiarPersona(

  tipo,

  dia,

  index,

  valor

){

  const tabla =
    obtenerTabla(tipo);


  tabla[dia][index] =
    valor;


  actualizarResumen();

}


// =========================
// AGREGAR PERSONA
// =========================

function agregarPersona(
  tipo,
  dia
){

  const tabla =
    obtenerTabla(tipo);


  tabla[dia].push("");


  const contenedor =
    document.getElementById(
      `${tipo}-${dia}`
    );


  const index =
    tabla[dia].length - 1;


  crearFila(

    contenedor,

    tipo,

    dia,

    index,

    ""

  );

}


// =========================
// ELIMINAR PERSONA
// =========================

function eliminarPersona(

  tipo,

  dia,

  index

){

  const tabla =
    obtenerTabla(tipo);


  tabla[dia].splice(
    index,
    1
  );


  if(
    tabla[dia].length === 0
  ){

    tabla[dia].push("");

  }


  renderHorario();

  actualizarResumen();

}


// =========================
// RESUMEN
// =========================

function actualizarResumen(){

  const resumen =
    document.getElementById(
      "resumen-personas"
    );


  const contador = {};


  [
    columnasDia,
    columnasNoche
  ]
  .forEach(tabla => {

    Object.keys(tabla)
      .forEach(dia => {

        tabla[dia]
          .forEach(nombre => {

            if(!nombre)
              return;


            contador[nombre] =

              (contador[nombre] || 0)
              + 1;

          });

      });

  });


  resumen.innerHTML = "";


  Object.keys(contador)
    .forEach(nombre => {

      const div =
        document.createElement(
          "div"
        );


      div.classList.add(
        "resumen-item"
      );


      div.innerHTML = `

        ${nombre}
        →
        ${contador[nombre]} turnos

      `;


      resumen.appendChild(
        div
      );

    });

}


// =========================
// GUARDAR HORARIO
// =========================

document
  .getElementById(
    "guardarHorarioBtn"
  )
  .addEventListener(
    "click",
    guardarHorario
  );


async function guardarHorario(){

  const boton =
    document.getElementById(
      "guardarHorarioBtn"
    );


  try{

    boton.innerText =
      "Guardando...";


    boton.disabled = true;


    await fetch(url, {

      method:"POST",

      mode:"cors",

      headers:{
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body:JSON.stringify({

        accion:"guardarHorario",

        columnasDia,

        columnasNoche

      })

    });


    boton.innerText =
      "Guardado ✓";


    setTimeout(() => {

      boton.innerText =
        "Guardar Horario";


      boton.disabled = false;

    }, 1200);

  }catch(error){

    console.log(
      "Error guardando:",
      error
    );


    boton.innerText =
      "Error";


    setTimeout(() => {

      boton.innerText =
        "Guardar Horario";


      boton.disabled = false;

    }, 1500);

  }

}


// =========================
// PDF
// =========================

document
  .getElementById(
    "exportarPDF"
  )
  .addEventListener(
    "click",
    exportarPDF
  );


function exportarPDF(){

  const elemento =
    document.querySelector(
      ".horarios-pdf"
    );


  document.body.classList.add(
    "pdf-mode"
  );


  const opciones = {

    margin:[10,10,10,10],

    filename:
      "horario-cocina.pdf",

    image:{
      type:"jpeg",
      quality:1
    },

    html2canvas:{

      scale:1.5,

      scrollX:0,

      scrollY:0

    },

    jsPDF:{

      unit:"mm",

      format:"a3",

      orientation:"landscape"

    }

  };


  html2pdf()
    .set(opciones)
    .from(elemento)
    .save()
    .then(() => {

      document.body.classList.remove(
        "pdf-mode"
      );

    });

}


// =========================
// VACIAR HORARIO
// =========================

document
  .getElementById(
    "vaciarHorarioBtn"
  )
  .addEventListener(
    "click",
    vaciarHorario
  );


async function vaciarHorario(){

  const boton =
    document.getElementById(
      "vaciarHorarioBtn"
    );


  try{

    boton.disabled = true;


    boton.innerText =
      "Vaciando...";


    // =====================
    // LIMPIAR TABLAS
    // =====================

    Object.keys(columnasDia)
      .forEach(dia => {

        columnasDia[dia] = [""];
        columnasNoche[dia] = [""];

      });


    // =====================
    // RENDER
    // =====================

    renderHorario();


    // =====================
    // GUARDAR
    // =====================

    await fetch(url, {

      method:"POST",

      mode:"cors",

      headers:{
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body:JSON.stringify({

        accion:"guardarHorario",

        columnasDia,

        columnasNoche

      })

    });


    boton.innerText =
      "Vaciado ✓";


    setTimeout(() => {

      boton.disabled = false;


      boton.innerText =
        "Vaciar Horario";

    }, 1200);

  }catch(error){

    console.log(error);


    boton.innerText =
      "Error";


    setTimeout(() => {

      boton.disabled = false;


      boton.innerText =
        "Vaciar Horario";

    }, 1500);

  }

}


// =========================
// INIT
// =========================

cargarDatos();