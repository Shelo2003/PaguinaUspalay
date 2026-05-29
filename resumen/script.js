// =====================================================
// EFECTO CARDS
// =====================================================

const cards =
  document.querySelectorAll(
    ".card"
  );


cards.forEach(card => {

  card.addEventListener(
    "mouseenter",
    () => {

      card.style.transform =
        "translateY(-6px) scale(1.01)";

    }
  );


  card.addEventListener(
    "mouseleave",
    () => {

      card.style.transform =
        "translateY(0px) scale(1)";

    }
  );

});


// =====================================================
// LOADED
// =====================================================

console.log(
  "Resumen Uspalay cargado correctamente"
);