const ticket = JSON.parse(localStorage.getItem("ticket"));
const contenedor = document.getElementById("ticketContainer");

if (!ticket) {
  contenedor.innerHTML = "<p>No hay ticket disponible.</p>";
} else {
  renderTicket();
}

function renderTicket() {
  let html = `
    <div class="ticket-titulo"><strong>Fútbol Para Todos</strong></div>
    <div class="ticket-info">Cliente: <strong>${ticket.nombre}</strong></div>
    <div class="ticket-info">Fecha: <strong>${ticket.fecha}</strong></div>

    <div class="ticket-titulo">Productos comprados</div>
  `;

  ticket.productos.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    html += `
      <div class="ticket-producto">
        <strong>${p.nombre}</strong><br>
        Cantidad: ${p.cantidad}<br>
        Subtotal: $${subtotal.toLocaleString("es-AR")}
      </div>
    `;
  });

  html += `
    <div class="ticket-total">
      Total: $${ticket.total.toLocaleString("es-AR")}
    </div>
  `;

  contenedor.innerHTML = html;
}

document.getElementById("btnDescargar").addEventListener("click", () => {
  window.print();
});

document.getElementById("btnReiniciar").addEventListener("click", () => {
  localStorage.removeItem("ticket");
  localStorage.removeItem("carrito");
  localStorage.removeItem("nombreUsuario");

  window.location.href = "encuesta.html";
});