const tabButtons = document.querySelectorAll('.tab-btn');

const tabContents = document.querySelectorAll('.tab-content');


// =========================
// PANTALLA CARGA
// =========================

function mostrarCargaInicial(){

    document.body.style.opacity =
        "0.6";


    document.body.style.pointerEvents =
        "none";


    const overlay =
        document.createElement("div");

    overlay.id =
        "overlay-carga";


    overlay.innerHTML = `

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

            ⏳ Cargando inventario...

        </div>

    `;


    document.body.appendChild(
        overlay
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


    const overlay =
        document.getElementById(
            "overlay-carga"
        );


    if(overlay){

        overlay.remove();

    }

}


// =========================
// PESTAÑAS
// =========================

tabButtons.forEach(button => {

    button.addEventListener('click', () => {

        const target = button.dataset.tab;

        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        button.classList.add('active');

        document
            .getElementById(target)
            .classList.add('active');

    });

});


// =========================
// URL
// =========================

const url =
"https://script.google.com/macros/s/AKfycbwIMlU6IXzxrApBscFjy648rTxQalvoCE0ssQjK25kFOATadQlHIeogFzbu-CPQHiQu/exec";


// =========================
// DATOS
// =========================

let categorias = [];

let productos = [];


// =========================
// ELEMENTOS
// =========================

const productoInput =
    document.getElementById(
        'productoInput'
    );

const productosDatalist =
    document.getElementById(
        'productosDatalist'
    );

const categoriaSelect =
    document.getElementById('categoriaSelect');

const categoriaModificarSelect =
    document.getElementById('categoriaModificarSelect');

const filtroCategoriaTabla =
    document.getElementById('filtroCategoriaTabla');

const nombreProducto =
    document.getElementById('nombreProducto');

const stockProducto =
    document.getElementById('stockProducto');

const listaCategorias =
    document.getElementById('listaCategorias');

const nuevaCategoria =
    document.getElementById('nuevaCategoria');

const agregarCategoriaBtn =
    document.getElementById('agregarCategoriaBtn');

const nombreProductoInput =
    document.getElementById('nombreProductoInput');

const stockProductoInput =
    document.getElementById('stockProductoInput');

const agregarProductoBtn =
    document.getElementById('agregarProductoBtn');

const nuevoTotal =
    document.getElementById('nuevoTotal');

const editarTotalBtn =
    document.getElementById('editarTotalBtn');

const tablaInventarioBody =
    document.getElementById('tablaInventarioBody');


// =========================
// TOAST
// =========================

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


// =========================
// OBTENER DATOS
// =========================

async function obtenerDatos(){

    try{

        const respuesta =
            await fetch(url);

        const datos =
            await respuesta.json();


        categorias =
            datos.categorias;

        productos =
            datos.productos;


        cargarCategorias();

        cargarFiltroTabla();

        cargarProductos();

        cargarTablaInventario();

    }catch(error){

        console.error(error);

    }

}


// =========================
// CARGAR CATEGORÍAS
// =========================

function cargarCategorias(){

    categoriaSelect.innerHTML = `
        <option value="">
            Seleccionar categoría
        </option>
    `;


    categoriaModificarSelect.innerHTML = `
        <option value="">
            Seleccionar categoría
        </option>
    `;


    listaCategorias.innerHTML = "";


    categorias.forEach(categoria => {

        const option1 =
            document.createElement('option');

        option1.value = categoria.nombre;

        option1.textContent = categoria.nombre;

        categoriaSelect.appendChild(option1);


        const option2 =
            document.createElement('option');

        option2.value = categoria.nombre;

        option2.textContent = categoria.nombre;

        categoriaModificarSelect.appendChild(option2);


        const div =
            document.createElement('div');

        div.classList.add('categoria-item');

        div.textContent = categoria.nombre;

        listaCategorias.appendChild(div);

    });

}


// =========================
// CARGAR FILTRO TABLA
// =========================

function cargarFiltroTabla(){

    filtroCategoriaTabla.innerHTML = `
        <option value="">
            Todas las categorías
        </option>
    `;


    categorias.forEach(categoria => {

        const option =
            document.createElement('option');

        option.value = categoria.nombre;

        option.textContent = categoria.nombre;

        filtroCategoriaTabla.appendChild(option);

    });

}


// =========================
// CARGAR PRODUCTOS
// =========================

function cargarProductos(categoriaSeleccionada = ""){

    productosDatalist.innerHTML = "";


    let productosFiltrados =
        productos;


    if(categoriaSeleccionada !== ""){

        productosFiltrados =
            productos.filter(producto => {

                return producto.categoria === categoriaSeleccionada;

            });

    }


    productosFiltrados.forEach(producto => {

        const option =
            document.createElement('option');

        option.value =
            producto.nombre;

        productosDatalist.appendChild(option);

    });

}


// =========================
// CARGAR TABLA INVENTARIO
// =========================

function cargarTablaInventario(categoria = ""){

    tablaInventarioBody.innerHTML = "";


    let productosFiltrados =
        productos;


    if(categoria !== ""){

        productosFiltrados =
            productos.filter(producto => {

                return producto.categoria === categoria;

            });

    }


    productosFiltrados.forEach(producto => {

        const fila =
            document.createElement('tr');


        fila.innerHTML = `

            <td>${producto.id}</td>

            <td>${producto.nombre}</td>

            <td>${producto.categoria}</td>

            <td>${producto.stock}</td>

        `;


        tablaInventarioBody.appendChild(fila);

    });

}


// =========================
// FILTRAR TABLA
// =========================

filtroCategoriaTabla.addEventListener('change', () => {

    const categoria =
        filtroCategoriaTabla.value;


    cargarTablaInventario(categoria);

});


// =========================
// FILTRAR PRODUCTOS
// =========================

categoriaModificarSelect.addEventListener('change', () => {

    const categoria =
        categoriaModificarSelect.value;


    cargarProductos(categoria);


    resetearModificarProducto();

});


// =========================
// MOSTRAR PRODUCTO
// =========================

productoInput.addEventListener('input', () => {

    const nombreBuscado =
        productoInput.value
        .trim()
        .toLowerCase();


    const producto =
        productos.find(p => {

            return p.nombre
                .toLowerCase() ===
                nombreBuscado;

        });


    if(producto){

        nombreProducto.textContent =
            producto.nombre;

        stockProducto.textContent =
            producto.stock;

        nuevoTotal.value =
            producto.stock;

    }else{

        nombreProducto.textContent =
            "Ninguno";

        stockProducto.textContent =
            "0";

        nuevoTotal.value = "";

    }

});


// =========================
// RESETEAR MODIFICACIÓN
// =========================

function resetearModificarProducto(){

    productoInput.value = "";

    nombreProducto.textContent =
        "Ninguno";

    stockProducto.textContent =
        "0";

    nuevoTotal.value = "";

}


function bloquearBoton(boton){

    boton.disabled = true;

    boton.style.opacity = "0.6";

}


function desbloquearBoton(boton){

    boton.disabled = false;

    boton.style.opacity = "1";

}


// =========================
// BLOQUEAR FORMULARIO
// =========================

function bloquearFormularioProducto(){

    agregarProductoBtn.disabled = true;

    agregarProductoBtn.innerText =
        "Guardando producto...";

    agregarProductoBtn.style.opacity =
        "0.6";


    nombreProductoInput.disabled =
        true;

    categoriaSelect.disabled =
        true;

    stockProductoInput.disabled =
        true;


    nombreProductoInput.style.opacity =
        "0.6";

    categoriaSelect.style.opacity =
        "0.6";

    stockProductoInput.style.opacity =
        "0.6";

}


// =========================
// DESBLOQUEAR FORMULARIO
// =========================

function desbloquearFormularioProducto(){

    agregarProductoBtn.disabled = false;

    agregarProductoBtn.innerText =
        "Agregar Producto";

    agregarProductoBtn.style.opacity =
        "1";


    nombreProductoInput.disabled =
        false;

    categoriaSelect.disabled =
        false;

    stockProductoInput.disabled =
        false;


    nombreProductoInput.style.opacity =
        "1";

    categoriaSelect.style.opacity =
        "1";

    stockProductoInput.style.opacity =
        "1";

}


// =========================
// BLOQUEAR CATEGORÍA
// =========================

function bloquearFormularioCategoria(){

    agregarCategoriaBtn.disabled =
        true;

    agregarCategoriaBtn.innerText =
        "Guardando categoría...";

    agregarCategoriaBtn.style.opacity =
        "0.6";


    nuevaCategoria.disabled =
        true;

    nuevaCategoria.style.opacity =
        "0.6";

}


// =========================
// DESBLOQUEAR CATEGORÍA
// =========================

function desbloquearFormularioCategoria(){

    agregarCategoriaBtn.disabled =
        false;

    agregarCategoriaBtn.innerText =
        "Agregar Categoría";

    agregarCategoriaBtn.style.opacity =
        "1";


    nuevaCategoria.disabled =
        false;

    nuevaCategoria.style.opacity =
        "1";

}


// =========================
// BLOQUEAR MODIFICAR
// =========================

function bloquearModificarProducto(){

    editarTotalBtn.disabled =
        true;

    editarTotalBtn.innerText =
        "Guardando cambios...";

    editarTotalBtn.style.opacity =
        "0.6";


    categoriaModificarSelect.disabled =
        true;

    productoInput.disabled =
        true;

    nuevoTotal.disabled =
        true;


    categoriaModificarSelect.style.opacity =
        "0.6";

    productoInput.style.opacity =
        "0.6";

    nuevoTotal.style.opacity =
        "0.6";

}


// =========================
// DESBLOQUEAR MODIFICAR
// =========================

function desbloquearModificarProducto(){

    editarTotalBtn.disabled =
        false;

    editarTotalBtn.innerText =
        "Cambiar Total";

    editarTotalBtn.style.opacity =
        "1";


    categoriaModificarSelect.disabled =
        false;

    productoInput.disabled =
        false;

    nuevoTotal.disabled =
        false;


    categoriaModificarSelect.style.opacity =
        "1";

    productoInput.style.opacity =
        "1";

    nuevoTotal.style.opacity =
        "1";

}


// =========================
// AGREGAR CATEGORÍA
// =========================

agregarCategoriaBtn.addEventListener('click', async () => {

    bloquearFormularioCategoria();

    const nombre =
        nuevaCategoria.value.trim();


    if(nombre === ""){

        desbloquearFormularioCategoria();

        showToast(
            "Ingrese categoría",
            "error"
        );

        return;

    }


    try{

        await fetch(url, {

            method: "POST",

            body: JSON.stringify({

                accion: "agregarCategoria",

                nombre

            })

        });


        nuevaCategoria.value = "";

        await obtenerDatos();


        showToast(
            "Categoría agregada correctamente",
            "success"
        );

    }catch(error){

        console.error(error);

        showToast(
            "Error al agregar categoría",
            "error"
        );

    }


    desbloquearFormularioCategoria();

});


// =========================
// AGREGAR PRODUCTO
// =========================

agregarProductoBtn.addEventListener('click', async () => {

    bloquearFormularioProducto();

    const nombre =
        nombreProductoInput.value.trim();

    const categoria =
        categoriaSelect.value;

    const stock =
        Number(stockProductoInput.value);


    if(nombre === ""){

        desbloquearFormularioProducto();

        showToast(
            "Ingrese nombre",
            "error"
        );

        return;

    }


    if(categoria === ""){

        desbloquearFormularioProducto();

        showToast(
            "Seleccione categoría",
            "error"
        );

        return;

    }


    if(isNaN(stock)){

        desbloquearFormularioProducto();

        showToast(
            "Ingrese stock",
            "error"
        );

        return;

    }


    try{

        await fetch(url, {

            method: "POST",

            body: JSON.stringify({

                accion: "agregarProducto",

                nombre,
                categoria,
                stock

            })

        });


        nombreProductoInput.value = "";

        stockProductoInput.value = "";

        categoriaSelect.value = "";


        await obtenerDatos();


        showToast(
            "Producto agregado correctamente",
            "success"
        );

    }catch(error){

        console.error(error);

        showToast(
            "Error al agregar producto",
            "error"
        );

    }


    desbloquearFormularioProducto();

});


// =========================
// CAMBIAR TOTAL
// =========================

editarTotalBtn.addEventListener('click', async () => {

    bloquearModificarProducto();

    const nombreBuscado =
        productoInput.value
        .trim()
        .toLowerCase();


    const producto =
        productos.find(p => {

            return p.nombre
                .toLowerCase() ===
                nombreBuscado;

        });


    const total =
        Number(nuevoTotal.value);


    if(!producto){

        desbloquearModificarProducto();

        showToast(
            "Seleccione producto válido",
            "error"
        );

        return;

    }


    if(isNaN(total) || total < 0){

        desbloquearModificarProducto();

        showToast(
            "Ingrese total válido",
            "error"
        );

        return;

    }


    try{

        await fetch(url, {

            method: "POST",

            body: JSON.stringify({

                accion: "cambiarTotal",

                id: producto.id,
                total

            })

        });


        await obtenerDatos();

        resetearModificarProducto();


        showToast(
            "Stock actualizado correctamente",
            "success"
        );

    }catch(error){

        console.error(error);

        showToast(
            "Error al actualizar stock",
            "error"
        );

    }


    desbloquearModificarProducto();

});


// =========================
// INICIAR
// =========================

window.addEventListener(
    "load",
    async () => {

        mostrarCargaInicial();

        await obtenerDatos();

        ocultarCargaInicial();

        console.log(
            "Inventario conectado correctamente"
        );

    }
);