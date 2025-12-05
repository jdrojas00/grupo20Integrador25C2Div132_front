let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedor = document.getElementById("carritoContainer");
const totalBox = document.getElementById("totalBox");
const btnFinalizar = document.getElementById("btnFinalizar");

function renderCarrito() {
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p class='carrito-vacio'>Tu carrito está vacío.</p>";
    totalBox.textContent = "";
    btnFinalizar.style.display = "none";
    return;
  }

  carrito.forEach(prod => {
    const item = document.createElement("div");
    item.classList.add("item-carrito");

    item.innerHTML = `
      <div class="item-info">
        <img src="http://localhost:3000/${prod.imagen}">
        <div>
          <div class="item-titulo">${prod.nombre}</div>
          <div class="item-precio">$${prod.precio.toLocaleString("es-AR")}</div>
        </div>
      </div>

      <div class="controls">
        <button onclick="restar(${prod.id})">-</button>
        <span>${prod.cantidad}</span>
        <button onclick="sumar(${prod.id})">+</button>
        <button onclick="eliminar(${prod.id})">Eliminar</button>
      </div>
    `;

    contenedor.appendChild(item);
  });

  actualizarTotal();
}

function actualizarTotal() {
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  totalBox.textContent = `Total: $${total.toLocaleString("es-AR")}`;
}

function guardar() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function sumar(id) {
  const prod = carrito.find(p => p.id === id);
  prod.cantidad++;
  guardar();
  renderCarrito();
}

function restar(id) {
  const prod = carrito.find(p => p.id === id);

  if (prod.cantidad > 1) {
    prod.cantidad--;
  } else {
    carrito = carrito.filter(p => p.id !== id);
  }

  guardar();
  renderCarrito();
}

function eliminar(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardar();
  renderCarrito();
}

async function enviarCompra() {
  const datos = JSON.parse(localStorage.getItem("ticket"));

  if (!datos) {
    console.error("No hay datos en localStorage");
    return;
  }

  const producto_id = datos.productos.map(p => p.id);

  const compra = {
    producto_id: producto_id,
    nombre_usuario: datos.nombre,
    precio_total: datos.total
  };

  try {
    const res = await fetch("http://localhost:3000/api/ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(compra)
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error en la compra:", errorData);
    }
    
    console.log("Compra enviada con éxito.");
    return await res.json();

  } catch (err) {
    console.log("Error:", err);
    alert("No se pudo completar la compra: " + err.message);
  }
}

btnFinalizar.addEventListener("click", async () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  if (!confirm("¿Confirmar compra?")) return;

  const nombreUsuario = localStorage.getItem("nombreUsuario");

  const ticket = {
    nombre: nombreUsuario,
    fecha: new Date().toLocaleString("es-AR"),
    productos: carrito,
    total: carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)
  };

  localStorage.setItem("ticket", JSON.stringify(ticket));

  try {
    await enviarCompra(); 
    
    window.location.href = "ticket.html"; 

  } catch (error) {
    console.error("Fallo en el proceso de compra.");
  }
});

renderCarrito();