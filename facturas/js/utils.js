function showToast(message, type = "success") {

  const toast =
    document.getElementById("toast");

  if (!toast) return;


  toast.textContent = message;

  toast.className =
    "toast show " + type;


  setTimeout(() => {

    toast.className = "toast";

  }, 2500);

}