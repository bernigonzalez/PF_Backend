const { Producto, Categoria } = require('../db')
const DATA_PRODUCTS = require("../data/productos.db.js");

const loadProductos = async () => {
   try {
      let categories = await Categoria.findAll({});
      
       categories = categories.map(cat => cat.toJSON());
       
      const productosMaped = DATA_PRODUCTS.map(e => {
         const categoriaId = categories.find(cat => cat.nombre === e.category).id;
         
         return {
            title: e.title,
            price: e.price,
            description: e.description,
            images: e.images,
            size: e.size,
            cantidad: e.cantidad,
            categoriaId,
         };
      });
      productosMaped.forEach(async (e) => {
         await Producto.findOrCreate({
            where: {
               ...e
            },
         });
      });

      console.log("Productos cargados exitosamente");
   } catch (error) {
      // console.log(error);
      console.log("No ha sido posible cargar los productos en la DB");
   }
}

module.exports = loadProductos;