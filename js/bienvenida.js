const boton = document.getElementById("continuar-boton");
const input = document.getElementById("nombreUsuario");
const admin = document.getElementById("admin-boton");

admin.addEventListener("click", () => {
    window.location.href = "http://localhost:3000/";
});

boton.addEventListener("click", () => {
    const nombre = input.value.trim();
    if (nombre === "") {
        const errorSpan = document.getElementById("usuario-error");
        let html = "<span>Por favor, ingrese su nombre.</span>";
        errorSpan.innerHTML = html;
        return;
    }

    localStorage.setItem("nombreUsuario", nombre);
    window.location.href = "productos.html";
});
