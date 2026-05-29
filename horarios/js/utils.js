function showToast(
  mensaje,
  tipo = "success"
){

  const toast =
    document.getElementById(
      "toast"
    );


  toast.textContent =
    mensaje;


  toast.className =
    `toast show ${tipo}`;


  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

  }, 3000);

}