// =========================
// FETCH CON REINTENTOS
// =========================

async function fetchConReintento(

    url,
    nombre,
    textoCarga

){

    const maxIntentos = 3;

    const espera = 3000;


    for(

        let intento = 1;

        intento <= maxIntentos;

        intento++

    ){

        try{

            const respuesta =
                await fetch(url);


            if(!respuesta.ok){

                throw new Error(
                    "Error fetch"
                );

            }


            return true;


        }catch(error){

            console.log(

                `Error en ${nombre} - intento ${intento}`,

                error

            );


            // =========================
            // REINTENTO
            // =========================

            if(intento < maxIntentos){

                textoCarga.innerText =

                    `Reintentando ${nombre} (${intento}/${maxIntentos})...`;


                await new Promise(resolve => {

                    setTimeout(
                        resolve,
                        espera
                    );

                });

            }


            // =========================
            // ERROR FINAL
            // =========================

            else{

                textoCarga.innerHTML = `

                    ❌ Error al conectar con ${nombre}
                    <br><br>
                    Revisa internet y recarga la página.

                `;


                throw error;

            }

        }

    }

}


// =========================
// PRECARGA SISTEMA
// =========================

async function precargarSistema(){

    // =========================
    // YA PRECARGÓ
    // =========================

    const yaPrecargo =

        sessionStorage.getItem(
            "uspalay_precargado"
        );


    // =========================
    // ENTRAR DIRECTO
    // =========================

    if(yaPrecargo){

        const pantalla =
            document.getElementById(
                "pantallaCarga"
            );


        if(pantalla){

            pantalla.remove();

        }

        return;

    }


    const textoCarga =
        document.getElementById(
            "textoCarga"
        );


    try{

        // =========================
        // MENSAJE
        // =========================

        textoCarga.innerText =
            "Cargando sistema...";


   
        // CARGAR TODO JUNTO
     

        await Promise.all([

            fetchConReintento(

                "https://script.google.com/macros/s/AKfycbwIMlU6IXzxrApBscFjy648rTxQalvoCE0ssQjK25kFOATadQlHIeogFzbu-CPQHiQu/exec",

                "inventario",

                textoCarga

            ),

            fetchConReintento(

                "https://script.google.com/macros/s/AKfycbxVrGYmQIg8cDXJVPWrtMNKMA6ZrrFAZpGR833dSwgONlXLolB_lTy5BoZqURDe9VM/exec",

                "facturas",

                textoCarga

            ),

            fetchConReintento(

                "https://script.google.com/macros/s/AKfycbyaezC7kHu3hQram5iAS81pHg5S8gAsohuQdeV7eVTQrFVJ8-Dkr5SUFqMawXqe_PAb/exec",

                "boletas",

                textoCarga

            ),

            fetchConReintento(

                "https://script.google.com/macros/s/AKfycbyJ32nhAERU_zwIlugAR1iVDpETnGsmGSIxjLfnRMZWq8V1a8IUIT9yMYuunwVnMwxB/exec",

                "planificación",

                textoCarga

            )

        ]);


        // =========================
        // FINAL
        // =========================

        textoCarga.innerText =
            "Preparando sistema...";


        await new Promise(resolve => {

            setTimeout(resolve, 700);

        });


        // =========================
        // GUARDAR SESIÓN
        // =========================

        sessionStorage.setItem(

            "uspalay_precargado",

            "true"

        );


        const pantalla =
            document.getElementById(
                "pantallaCarga"
            );


        pantalla.style.opacity =
            "0";


        pantalla.style.transition =
            "0.4s";


        setTimeout(() => {

            pantalla.remove();

        }, 400);


    }catch(error){

        console.log(error);

    }

}


// =========================
// INIT
// =========================

window.addEventListener(
    "load",
    precargarSistema
);


console.log(
    "Portal principal cargado correctamente"
);


const cards =
    document.querySelectorAll(
        '.modulo-card'
    );


cards.forEach(card => {

    card.addEventListener(
        'mouseenter',
        () => {

            card.style.cursor =
                'pointer';

        }
    );

});