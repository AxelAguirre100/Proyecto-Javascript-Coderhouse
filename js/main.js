const usuarios = [{
  nombre: 'Juan',
  mail: 'Juanhernandez@mail.com',
  pass: 'Juan321'
},
{
  nombre: 'Luciano',
  mail: 'Luciano4231@mail.com',
  pass: 'Luciano321'
},
{
  nombre: 'Belén',
  mail: 'Belen@mail.com',
  pass: 'Belen321'
}]

let carrito = [];
const mailLogin = document.getElementById('emailLogin');
const passLogin = document.getElementById('passwordLogin');
const recordar = document.getElementById('recordarme');
const btnLogin = document.getElementById('login');
const modalEl = document.getElementById('modalLogin');
const modal = new bootstrap.Modal(modalEl);
const toggles = document.querySelectorAll('.toggles');
const caja = document.querySelector('.main');
const carritoEl = document.querySelector('.carritoItems');
const precioEl = document.querySelector('.precio');
const carritoC = document.querySelector('.carrito');
const btnCarrito = document.querySelector('.btnCarrito');
const desaparacer = document.querySelector('.caja');
const btnInicio = document.querySelector('.btnInicio');
const btnPagar = document.querySelector('.btnPagar');
const cuota = document.querySelector('.cuota');
const categorias = document.getElementById('categorias');
const loginForm = document.getElementById('loginForm')
const nombreUsuarioMensaje = document.getElementById('nombreUsuario')

///////////////////login//////////////////
/////////////////////////////////////////
//Valida si un usuario esta registrado//
function validarUsuario(usuarios, user, pass) {
  let encontrado = usuarios.find((usuarios) => usuarios.mail == user);
  let resultado = false;
  if (typeof encontrado === 'undefined') {
    return false;
  } else {
    encontrado.pass != pass ? (resultado = false):(resultado = encontrado)
    return resultado
  }
}

function presentarInfo(array, clase) {
  array.forEach(element => {
    element.classList.toggle(clase);
  });
}

//Funcion para guardar datos si el usuario lo desea//
function guardarDatos(usuarios, storage) {
  const usuario = {
    'name': usuarios.nombre,
    'user': usuarios.mail,
    'pass': usuarios.pass
  }
  storage.setItem('usuario', JSON.stringify(usuario));
}
//Funcion para borrar datos si el usuario cierra sesion//
function borrarDatos() {
  localStorage.clear();
  sessionStorage.clear();
}

function recuperarUsuario(storage) {
  let usuarioEnStorage = JSON.parse(storage.getItem('usuario'));
  return usuarioEnStorage;
}

function saludar(usuario) {
  nombreUsuario.innerHTML = `Bienvenido/a, <span>${usuario.name}</span>`
}

function estaLogueado(usuario) {
  if (usuario) {
    saludar(usuario);
    presentarInfo(toggles, 'd-none')
  }
}

//////Declaracion Promesa/////
const iniciarSesionPromesa=(respuesta)=>{
  return new Promise((resolve,reject)=>{
      if (respuesta){
          resolve('Login Exitoso');
      }else{
          reject('Login Fallido');
      }
  })
} 
//////////////////////////////
btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  let data = validarUsuario(usuarios, mailLogin.value, passLogin.value);
  iniciarSesionPromesa(!data).then((respuesta)=>{
    Swal.fire({
      title: 'No se ha podido iniciar sesion',
      text: 'Usuario y/o contraseña erróneos',
      icon: 'error'
    })
  }).catch((respuesta)=>{
  if (recordar.checked) {
    guardarDatos(data, localStorage);
    saludar(recuperarUsuario(localStorage));
  } else {
    guardarDatos(data, sessionStorage);
    saludar(recuperarUsuario(sessionStorage));
  }
  modal.hide();
  presentarInfo(toggles, 'd-none');
  })
})

btnLogout.addEventListener('click', () => {
  borrarDatos();
  presentarInfo(toggles, 'd-none');
  nombreUsuario.innerHTML = ``
});

window.onload = () => estaLogueado(recuperarUsuario(localStorage));
//////////////////////////////////////////
//Renderiza los productos dinamicamente//
async function cargarProductos() {
  const respuesta = await fetch('./js/productos.json');
  const productosJson = await respuesta.json();
  caja.innerHTML = ``;
  productosJson.forEach((item) => {
    let tarjeta = document.createElement('div');
    tarjeta.className = 'col';
    tarjeta.innerHTML = `
        <div class='card ${item.categoria}' id='${item.categoria}'>
          <img src='${item.img}' class='card-img-top' alt='...'>
          <div class='card-body'>
            <h5 class='card-title'>${item.serie}</h5>
            <p class='card-text'>${item.fabricante} cuenta con ${item.memoria} precio ${item.precio}</p>
            <button id='agregar${item.id}' class='btn btn-success'>Comprar</button>
          </div>
        </div>
      `;
    caja.append(tarjeta)
    const button = document.getElementById(`agregar${item.id}`);
    button.addEventListener(`click`, () => agregarCarrito(item.id));
  })
}

//////////////////////////////////////////////////////////////////////////////////////
//Renderiza los productos de categoria procesador si el usuario checkea en el input//
async function procesadoresRenderizar() {
  const respuesta = await fetch('./js/productos.json');
  const productosJson = await respuesta.json();
  const productoFiltrado = productosJson.filter(producto => producto.categoria == 'procesador');
  caja.innerHTML = ``;
  productoFiltrado.forEach((item) => {
    let tarjeta = document.createElement('div');
    tarjeta.className = 'col';
    tarjeta.innerHTML = `
      <div class='card ${item.categoria}' id='${item.categoria}'>
        <img src='${item.img}' class='card-img-top' alt='...'>
        <div class='card-body'>
          <h5 class='card-title'>${item.serie}</h5>
          <p class='card-text'>${item.fabricante} cuenta con ${item.memoria} precio ${item.precio}</p>
          <button id='agregar${item.id}' class='btn btn-success'>Comprar</button>
        </div>
      </div>
    `;
    caja.append(tarjeta)
    const button = document.getElementById(`agregar${item.id}`);
    button.addEventListener(`click`, () => agregarCarrito(item.id));
  })
}
///////////////////////////////////////////////////////////////////////////////////
//Renderiza los productos de categoria grafica si el usuario checkea en el input//
async function graficasRenderizar() {
  const respuesta = await fetch('./js/productos.json');
  const productosJson = await respuesta.json();
  const productoFiltrado = productosJson.filter(producto => producto.categoria == 'grafica');
  caja.innerHTML = ``;
  productoFiltrado.forEach((item) => {
    let tarjeta = document.createElement('div');
    tarjeta.className = 'col';
    tarjeta.innerHTML = `
      <div class='card ${item.categoria}' id='${item.categoria}'>
        <img src='${item.img}' class='card-img-top' alt='...'>
        <div class='card-body'>
          <h5 class='card-title'>${item.serie}</h5>
          <p class='card-text'>${item.fabricante} cuenta con ${item.memoria} precio ${item.precio}</p>
          <button id='agregar${item.id}' class='btn btn-success'>Comprar</button>
        </div>
      </div>
    `;
    caja.append(tarjeta)
    const button = document.getElementById(`agregar${item.id}`);
    button.addEventListener(`click`, () => agregarCarrito(item.id));
  })
}
//////////////////////////////////////////
//Renderiza los productos en el carrito//
function ponerCarrito() {
  carritoEl.innerHTML = '';
  let i = 0;
  carrito.forEach((item) => {
    carritoEl.innerHTML += `
        <div class='col'>
          <div class='card'>
            <div class='informacion'>
              <img src='${item.img}' class='card-img-top' alt='...'>
            </div>
            <div class='card-body'>
              <p class='card-title'>${item.serie}</p>
              <p>Precio: ${item.precio}</p>
              <div id='botonMenosCantidad${i}' class='btn menos btn-danger'>-</div>
              <div class='numero'>
                <p>Cantidad: ${item.cantidad}</p>
              </div>
              <div id='botonMasCantidad${i}' class='btn mas btn-primary'>+</div> <br>
              <div id='quitar${i}' class='btn btn-danger quitar'>
                Quitar
              </div>
            </div>
          </div>
        </div>
    `;
    i++;
  });
  botonMas();
  botonMenos();
  quitarFuncion();
}
///////////////////////////////////////////////////////////////
//Muestra el valor de cada cuota seleccionada por los inputs//
function total() {
  let precioTotal = 0;
  carrito.forEach((item) => {
    precioTotal += item.precio * item.cantidad;
  });
  precioEl.innerHTML = `Total: $${precioTotal}`
  document.addEventListener('input', (e) => {
    if (e.target.getAttribute('name') == 'cuotas')
      cuota.innerHTML = `
      Valor de cuotas: ${parseFloat(precioTotal / e.target.value).toFixed(2)}`
  });
}
///////////////////////////////////////
//actualiza el contenido del carrito//
function actualizarCarrito() {
  ponerCarrito();
  total();
}

//////////////////////////////////////
//Agrega productos al array carrito//
const agregarCarrito = async (productoID) => {
  const existe = carrito.some(prod => prod.id === productoID);
  if (existe) {
    Swal.fire({
      title: 'Compra repetida',
      text: 'El producto ya esta en el carrito',
      icon: 'info'
    });
  } else {
    const respuesta = await fetch('./js/productos.json');
    const productosJson = await respuesta.json(); 
    const item = productosJson.find((producto) => producto.id === productoID); 
    carrito.push({ serie: item.serie, cantidad: 1, id: item.id, precio: item.precio, img: item.img, stock: item.stock });
    Swal.fire({
      title: 'Añadido al carrito',
      text: 'La cantidad de unidades se modifica en el carrito',
      icon: 'success'
    });
  }
  actualizarCarrito();
}
///////////////////////////////////////////////
//Funcion para quitar productos del carrito///
function quitarDelCarrito(id) {
  carrito = carrito.filter((item) => item.id !== id);
  actualizarCarrito();
  cuota.innerHTML = ``
}
///////////////////Botones///////////////////////
////////////////////////////////////////////////
//Funcion para quitar un producto del carrito//
function quitarFuncion() {
  let i = 0;
  carrito.forEach((element) => {
    let idBtnQuitar = 'quitar' + i;
    const btnQuitar = document.getElementById(idBtnQuitar);
    btnQuitar.addEventListener('click', (e) => {
      e.preventDefault();
      Swal.fire({
        title: 'Eliminar producto',
        text: '¿Esta seguro de elimiar el producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'no'
      })
        .then((result) => {
          if (result.isConfirmed) {
            quitarDelCarrito(element.id);
            Swal.fire('Borrado', 'El producto ha sido eliminado', 'success')
          }
        })
    });
    i++;
  });
}
/////////////////////////////////////////////////
//Funcion para hacer un toggle de display none//
function esconder() {
  carritoC.classList.toggle('d-none');
  desaparacer.classList.toggle('d-none');
  btnInicio.classList.toggle('d-none');
  btnCarrito.classList.toggle('d-none');
  btnPagar.classList.toggle('d-none')
  categorias.classList.toggle('d-none')
  loginForm.classList.toggle('d-none')
  nombreUsuarioMensaje.classList.toggle('d-none')
}

btnInicio.addEventListener('click', () => {
  esconder()
});

btnCarrito.addEventListener('click', () => {
  esconder();
});
/////////////////////////////////////////////////////
//Boton de pagar vacia el carrito y simula un pago//
btnPagar.addEventListener('click', () => {
  actualizarCarrito();
  if (carrito.length > 0) {
    Swal.fire({
      title: 'Pago realizado',
      text: 'Gracias por comprar en nuestra tienda',
      icon: 'success'
    });
  } else {
    Swal.fire({
      title: 'Carrito Vacio',
      text: 'El carrito debe de tener algún producto para proceder al pago',
      icon: 'error'
    });
  }
  carrito = [];
  actualizarCarrito();
  esconder();
  cuota.innerHTML = ``
});

//////////////////////////////////////////////////////////
//Añade funcionalidad al boton mas y menos del carrito //
function botones(accion, id) {
  carrito = carrito.map((item) => {
    let cantidad = item.cantidad;
    if (item.id === id) {
      if (accion === 'menos' && cantidad > 1) {
        cantidad--;
      } else if (accion === 'mas' && cantidad < item.stock) {
        cantidad++;
      }
    }
    return {
      ...item,
      cantidad,
    };
  });
  actualizarCarrito();
}
/////////////////////////////////////////////////////////////////////////
//Agrega la funcion ''Botones'' al los botones mas y menos del carrito//
function botonMas() {
  let i = 0;
  carrito.forEach((item) => {
    let idBotonMas = 'botonMasCantidad' + i;
    const btnMas = document.getElementById(idBotonMas);
    btnMas.addEventListener('click', (e) => {
      e.preventDefault();
      botones('mas', item.id);
    });
    i++;
  });
}

function botonMenos() {
  let i = 0;
  carrito.forEach((item) => {
    let idBotonMenos = 'botonMenosCantidad' + i;
    const btnMenos = document.getElementById(idBotonMenos);
    btnMenos.addEventListener('click', (e) => {
      e.preventDefault();
      botones('menos', item.id);
    });
    i++;
  });
}
////////////////////////////////////////////////////////////
//Renderiza los productos dependiendo del valor del input//
document.addEventListener('input', (e) => {
  if (e.target.value == 'Graficas') {
    graficasRenderizar();
  } else if (e.target.value == 'Procesadores') {
    procesadoresRenderizar();
  } else if (e.target.value == 'Todo') {
    cargarProductos();
  }
})
/////////////////////////////////////////////////////////////
cargarProductos();
botones();