const { Subcategoria } = require('../db')
const DATA_SUBCATEGORIES = require("../data/subcategorias.db");


const loadCategorias = async () => {
   try {
      await Promise.all(DATA_SUBCATEGORIES.map(async (e) => {
         const subcategory = await Subcategoria.findOne({ where: { nombre: e.nombre } });

         !subcategory && Subcategoria.create(e);
      }));

      console.log("Subcategorías cargadas exitosamente");
   } catch (error) {
      console.log(error.message);
      console.log("No ha sido posible cargar las categorías en la DB");
   }
}


module.exports = loadCategorias;