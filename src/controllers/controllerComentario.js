const { Comentario, Pedido } = require("../db");
const { Op } = require('sequelize');

const createComentario = async (descripcion, usuarioId, productoId, rating) => {
   try {

      let comentarioExists = await Comentario.findOne({
         where: {
            [Op.and]: [
               {
                  usuarioId
               },
               {
                  productoId
               }
            ]
         }
      });
      if (comentarioExists) return { error: { status: 400, message: "Solo puede agregar un comentario por producto" } };

      let newComentario = await Comentario.create({ descripcion, usuarioId, productoId, rating });

      return newComentario;
   } catch (error) {
      console.log(error);
      return { error: {} };
   }
}

const getAllComentarios = async () => {
   try {
      const comentarios = await Comentario.findAll({})
      return comentarios;
   } catch (error) {
      console.log(error);
      return { error: {} }
   }
}


const getAllComentariosByProduct = async (productoId) => {
   try {
      const comentarios = await Comentario.findAll({ where: { productoId } })
      return comentarios;
   } catch (error) {
      console.log(error);
      return { error: {} }
   }
}


const updateComentario = async (id, descripcion) => {
   try {
      const comment = await Comentario.findByPk(id);
      if (!comment) return { error: { status: 404, message: "Comentario no encontrado" } };

      await Comentario.update(
         {
            descripcion
         },
         { where: { id } })
      return "Success update";

   } catch (error) {
      console.log(error)
      return { error: {} };
   }
}

const deleteComentario = async (id) => {
   try {
      let dest = await Comentario.findByPk(id);

      if (!dest) return { error: { status: 404, message: "Id no válido" } };

      // console.log(id)
      dest = await Comentario.destroy({
         where: { id }
      })

      return;
   } catch (error) {
      console.log(error);
      return { error: {} }
   }
}


module.exports = {
   createComentario,
   getAllComentarios,
   updateComentario,
   deleteComentario,
   getAllComentariosByProduct
}