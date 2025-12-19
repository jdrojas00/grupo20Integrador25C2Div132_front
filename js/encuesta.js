const form = document.getElementById("form-encuesta");
const modal = document.getElementById("modal-ok");
const cerrarModal = document.getElementById("cerrar-modal");
const omitir = document.getElementById("omitir");

// ---- VALIDACIONES SIMPLES ----
function validarFormulario() {
    const email = document.getElementById("email").value.trim();
    const opinion = document.getElementById("opinion").value.trim();

    if (!email) {
        alert("El email es obligatorio");
        return false;
    }
    if (!opinion) {
        alert("La opinión es obligatoria");
        return false;
    }

    return true;
}

// ---- ENVÍO A LA API ----
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const formData = new FormData(form);

    try {
        const resp = await fetch("http://localhost:3000/api/encuesta", {
            method: "POST",
            body: formData
        });

        const data = await resp.json();

        if (!resp.ok) {
            alert(data.msg || "Error al enviar encuesta");
            return;
        }

        // Mostrar modal de éxito
        modal.classList.remove("hidden");

   

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema con el servidor.");
    }
});


// ---- BOTÓN OMITIR ----
omitir.addEventListener("click", () => {
    window.location.href = "productos.html";
});

// ---- CERRAR MODAL ----
cerrarModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    window.location.href = "productos.html";
});
