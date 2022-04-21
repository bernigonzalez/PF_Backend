const loadProductos = require("./loadProductos");
const loadCategorias = require("./loadCategorias");
const loadUsuarios = require("./loadUsuarios");
const loadPedidos = require("./loadPedidos");
const loadOfertas = require("./loadOfertas");
const loadSubcategorias = require("./loadSubcategorias");

async function LoadDb() {
  try {
    await loadCategorias();
    await loadSubcategorias();
    await loadUsuarios();
    await loadProductos();
    await loadPedidos();
    await loadOfertas();
  } catch (error) {
    console.log(error);
  }
}

module.exports = LoadDb;
