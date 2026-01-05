const { jsPDF } = window.jspdf;

// Listado sin Sony Headphones
const productos = [
    { id: 1, nom: "MacBook Air M3", precio: 1299, cat: "Nuevo", clase: "nuevo", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300" },
    { id: 2, nom: "iPhone 15 Pro Max", precio: 1199, cat: "Oferta", clase: "oferta", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300" },
    { id: 3, nom: "iPad Pro M4", precio: 999, cat: "Nuevo", clase: "nuevo", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300" },
    { id: 4, nom: "Apple Watch Ultra", precio: 799, cat: "Oferta", clase: "oferta", img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300" },
    { id: 5, nom: "AirPods Max", precio: 549, cat: "Nuevo", clase: "nuevo", img: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=300" }
];

let carrito = [];
let usuarioActual = "";

// Login Demo automático si no existe
if(!localStorage.getItem("admin")) {
    localStorage.setItem("admin", JSON.stringify({pass: "1234", nombre: "Abel Rivas Serrano"}));
}

function iniciarSesion() {
    const user = document.getElementById('usuario-log').value;
    const pass = document.getElementById('clave-log').value;
    const datos = JSON.parse(localStorage.getItem(user));

    if (datos && datos.pass === pass) {
        usuarioActual = datos.nombre;
        document.getElementById('pantalla-login').classList.add('oculto');
        document.getElementById('pantalla-tienda').classList.remove('oculto');
        document.getElementById('nombre-usuario-display').innerText = usuarioActual;
        renderizarProductos();
    } else {
        alert("Prueba con usuario: admin y clave: 1234");
    }
}

function renderizarProductos() {
    const grid = document.getElementById('cuadricula-productos');
    grid.innerHTML = productos.map(p => `
        <div class="tarjeta-producto">
            <span class="etiqueta ${p.clase}">${p.cat}</span>
            <img src="${p.img}">
            <h4>${p.nom}</h4>
            <p><strong>$${p.precio}</strong></p>
            <button class="boton-comprar" onclick="agregar(${p.id})">Añadir al carrito</button>
        </div>
    `).join('');
}

function agregar(id) {
    const p = productos.find(x => x.id === id);
    carrito.push(p);
    actualizarUI();
}

function actualizarUI() {
    const lista = document.getElementById('lista-carrito');
    lista.innerHTML = carrito.map(i => `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem">
            <span>${i.nom}</span>
            <strong>$${i.precio}</strong>
        </div>
    `).join('');
    const total = carrito.reduce((sum, i) => sum + i.precio, 0);
    document.getElementById('monto-total').innerText = `$${total}`;
}

function vaciarCarrito() {
    carrito = [];
    actualizarUI();
}

function generarFacturaPDF() {
    if (carrito.length === 0) return alert("El carrito está vacío");
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("TECHSTORE ELITE - FACTURA", 20, 20);
    doc.setFontSize(12);
    doc.text(`Cliente: ${usuarioActual}`, 20, 35);
    let y = 55;
    carrito.forEach(i => {
        doc.text(`- ${i.nom}: $${i.precio}`, 20, y);
        y += 10;
    });
    doc.text(`TOTAL: $${carrito.reduce((s, i) => s + i.precio, 0)}`, 20, y + 10);
    doc.save("Factura_TechStore.pdf");
}