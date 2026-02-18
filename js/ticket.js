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
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Ticket de Compra', 105, 20, { align: 'center' });

  doc.setFontSize(14);
  doc.text(`Cliente: ${ticket.nombre}`, 20, 40);
  doc.text(`Fecha: ${ticket.fecha}`, 20, 50);

  doc.setFontSize(16);
  doc.text('Productos comprados', 20, 70);

  let y = 80;
  ticket.productos.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    doc.setFontSize(12);
    doc.text(`${p.nombre}`, 20, y);
    doc.text(`Cantidad: ${p.cantidad}`, 20, y + 10);
    doc.text(`Subtotal: $${subtotal.toLocaleString("es-AR")}`, 20, y + 20);
    y += 30;
  });

  doc.setFontSize(16);
  doc.text(`Total: $${ticket.total.toLocaleString("es-AR")}`, 20, y + 10);

  doc.save('ticket-compra.pdf');
});

document.getElementById("btnReiniciar").addEventListener("click", () => {
  // Solo limpiar carrito, pero mantener el ticket visible
  localStorage.removeItem("carrito");
  localStorage.removeItem("nombreUsuario");

  window.location.href = "encuesta.html";
});