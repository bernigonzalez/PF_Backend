const { createOferta } = require('../controllers/controllerOfertas');
const DATA_OFERTAS = require("../data/ofertas.db");


const loadCategorias = async () => {
   try {
      await Promise.all(DATA_OFERTAS.map(async (e) => {
         await createOferta(
            e.titulo,
            e.descripcion,
            e.porcentajeDescuento,
            e.productos
         );
      }));

      console.log("Ofertas cargadas exitosamente");
   } catch (error) {
      console.log(error.message);
      console.log("No ha sido posible cargar los ofertas en la DB");
   }
}


module.exports = loadCategorias;