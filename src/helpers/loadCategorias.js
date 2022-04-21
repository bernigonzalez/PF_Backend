const { Categoria } = require('../db')
const DATA_CATEGORIES = require("../data/categorias.db");


const loadCategorias = async () => {
   try {
      await Promise.all(DATA_CATEGORIES.map(async (e) => {
         const category = await Categoria.findOne({ where: { nombre: e.nombre } });

         !category && Categoria.create(e);
      }));

      console.log("Categorías cargadas exitosamente");
   } catch (error) {
      console.log(error.message);
      console.log("No ha sido posible cargar las categorías en la DB");
   }
}


module.exports = loadCategorias;