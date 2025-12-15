async function initDetalle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const resp = await fetch(`http://localhost:3000/api/products/${id}`);
  const data = await resp.json();

  const p = data.payload && data.payload.length > 0 ? data.payload[0] : null;

  if (!p) {
    document.getElementById("detalle-container").innerHTML =
      "<p style='color:red'>Producto no encontrado</p>";
    return;
  }

  const html = `
    <div class="detalle">
      <img src="http://localhost:3000/${p.imagen}" alt="${p.nombre}">

      <div class="info">
        <h1>${p.nombre}</h1>
        <p class="precio">$${p.precio.toLocaleString("es-AR")}</p>

        <p><strong>Tipo:</strong> ${p.tipo}</p>
        <p><strong>Descripción:</strong> ${p.descripcion ?? "Sin descripción disponible"}</p>

        <div id="btn-container"></div>
      </div>
    </div>
  `;

  document.getElementById("detalle-container").innerHTML = html;

  // manejar carrito
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let cantidades = {};

  const existente = carrito.find(x => x.id === p.id);

  if (existente) {
    cantidades[p.id] = existente.cantidad;
    renderSelector();
  } else {
    mostrarBoton();
  }

  function guardar() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function renderSelector() {
    document.getElementById("btn-container").innerHTML = `
      <div class="selector-cantidad">
        <button id="menos">−</button>
        <span id="cantidad">${cantidades[p.id]}</span>
        <button id="mas">+</button>
      </div>
    `;

    document.getElementById("menos").onclick = () => cambiarCantidad(-1);
    document.getElementById("mas").onclick = () => cambiarCantidad(1);
  }

  function mostrarBoton() {
    document.getElementById("btn-container").innerHTML = `
      <button class="boton-agregar" id="add">Agregar al carrito</button>
    `;
    document.getElementById("add").onclick = () => {
      carrito.push({ id: p.id, nombre: p.nombre, precio: p.precio, imagen: p.imagen, cantidad: 1 });
      cantidades[p.id] = 1;
      guardar();
      renderSelector();
    };
  }

  function cambiarCantidad(delta) {
    cantidades[p.id] += delta;

    if (cantidades[p.id] <= 0) {
      carrito = carrito.filter(x => x.id !== p.id);
      guardar();
      mostrarBoton();
      return;
    }

    const elem = carrito.find(x => x.id === p.id);
    elem.cantidad = cantidades[p.id];
    guardar();

    document.getElementById("cantidad").textContent = cantidades[p.id];
  }
}

initDetalle();
