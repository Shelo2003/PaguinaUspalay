console.log("Portal principal cargado correctamente");


const cards = document.querySelectorAll('.modulo-card');


cards.forEach(card => {

    card.addEventListener('mouseenter', () => {

        card.style.cursor = 'pointer';

    });

});