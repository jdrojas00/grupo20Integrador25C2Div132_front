const camisetas = [];
const calzado = [];

async function obtenerProductos() {
  try {
    const [respCamisetas, respCalzado] = await Promise.all([
      fetch('http://localhost:3000/api/products/type/camiseta'),
      fetch('http://localhost:3000/api/products/type/calzado')
    ]);

    const [dataCamisetas, dataCalzado] = await Promise.all([
      respCamisetas.json(),
      respCalzado.json()
    ]);

    camisetas.push(...dataCamisetas.payload);
    calzado.push(...dataCalzado.payload);

    console.log('Camisetas:', camisetas);
    console.log('Calzado:', calzado);

  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

let cantidades = {};
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function obtenerProducto(id) {
  return [...camisetas, ...calzado].find(p => p.id === Number(id));
}

function agregarAlCarrito(id) {
  const prod = obtenerProducto(id);
  if (!prod) return;

  const existente = carrito.find(p => p.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      imagen: prod.imagen,
      cantidad: 1
    });
  }

  guardarCarrito();
}

function cambiarCantidad(id, delta) {
  cantidades[id] += delta;

  if (cantidades[id] <= 0) {
    cantidades[id] = 0;

    carrito = carrito.filter(p => p.id !== Number(id));
    guardarCarrito();

    resetearBoton(id);
    return;
  }

  const prod = carrito.find(p => p.id === Number(id));
  if (prod) {
    prod.cantidad = cantidades[id];
  } else {
    agregarAlCarrito(id);
  }

  guardarCarrito();

  document.getElementById(`cantidad-${id}`).textContent = cantidades[id];
}

function activarSelector(id) {
  cantidades[id] = 1;

  agregarAlCarrito(id);

  renderSelector(id);
}

function renderSelector(id) {
  const cont = document.getElementById(`btn-container-${id}`);

  cont.innerHTML = `
    <div class="selector-cantidad">
      <button class="menos" data-id="${id}">−</button>
      <span id="cantidad-${id}">${cantidades[id]}</span>
      <button class="mas" data-id="${id}">+</button>
    </div>
  `;

  cont.querySelector(".menos").addEventListener("click", () => cambiarCantidad(id, -1));
  cont.querySelector(".mas").addEventListener("click", () => cambiarCantidad(id, 1));
}

function resetearBoton(id) {
  const cont = document.getElementById(`btn-container-${id}`);

  cont.innerHTML = `
    <button class="boton boton-agregar" data-id="${id}">Agregar al carrito</button>
  `;

  cont.querySelector(".boton-agregar").addEventListener("click", () => activarSelector(id));
}

function crearPaginador(lista, containerId, paginacionId) {
  let paginaActual = 1;
  const productosPorPagina = 4;

  function mostrarPagina(numPagina) {
    const inicio = (numPagina - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const listaPagina = lista.slice(inicio, fin);
    cargarProductos(listaPagina, containerId);
  }

  function crearPaginacion() {
    const cont = document.getElementById(paginacionId);
    if (!cont) return;
    const totalPaginas = Math.ceil(lista.length / productosPorPagina);
    cont.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === paginaActual) dot.classList.add("active");
      dot.addEventListener("click", () => {
        paginaActual = i;
        mostrarPagina(i);
        actualizarPaginacion();
      });
      cont.appendChild(dot);
    }
  }

  function actualizarPaginacion() {
    const cont = document.getElementById(paginacionId);
    if (!cont) return;
    const dots = cont.querySelectorAll(".dot");
    dots.forEach((dot, j) => {
      dot.classList.toggle("active", j + 1 === paginaActual);
    });
  }

  function cargarProductos(listaParaMostrar, contId) {
    const cont = document.getElementById(contId);
    let html = "";

    listaParaMostrar.forEach(prod => {
      const id = prod.id;

      const enCarrito = carrito.find(p => p.id === id);
      if (enCarrito) cantidades[id] = enCarrito.cantidad;

      html += `
        <div class="card-producto">
          <img src="http://localhost:3000/${prod.imagen}" alt="${prod.nombre}">
          <h3>${prod.nombre}</h3>
          <p class="precio">$${prod.precio.toLocaleString("es-AR")}</p>
          
          <div class="contenedor-boton" id="btn-container-${id}">
          ${cantidades[id] > 0 ? `
              <div class="selector-cantidad">
                <button class="menos" data-id="${id}">−</button>
                <span id="cantidad-${id}">${cantidades[id]}</span>
                <button class="mas" data-id="${id}">+</button>
              </div>
              `
          : `<button class="boton boton-agregar" data-id="${id}">Agregar al carrito</button>`
        }
          </div>
        </div>
      `;
    });

    cont.innerHTML = html;

    listaParaMostrar.forEach(prod => {
      const id = prod.id;
      const contBtn = document.getElementById(`btn-container-${id}`);

      if (cantidades[id] > 0) {
        renderSelector(id);
      } else {
        contBtn
          .querySelector(".boton-agregar")
          .addEventListener("click", () => activarSelector(id));
      }
    });
  }

  mostrarPagina(paginaActual);
  crearPaginacion();

  return { mostrarPagina, crearPaginacion, actualizarPaginacion };
}

async function init() {
  await obtenerProductos();

  crearPaginador(camisetas, "productos-cam", "paginacion-cam");
  crearPaginador(calzado, "productos-bot", "paginacion-bot");
}

init();