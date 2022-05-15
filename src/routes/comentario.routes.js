const { Router } = require("express");
const { createComentario, getAllComentarios, getAllComentariosByProduct, updateComentario, deleteComentario } = require("../controllers/controllerComentario");
const { authentication } = require("../middlewares");
const { check, validationResult } = require('express-validator');


const comentarioRouter = Router();

comentarioRouter.post("/", [
   check('descripcion', 'El campo descripcion es requerido').trim().not().isEmpty(),
   check('productoId', 'El campo productoId es un valor numérico requerido').trim().not().isEmpty().isInt(),
   check('rating', 'El campo rating es un valor numérico requerido').trim().not().isEmpty().isInt()
], authentication, async (req, res, next) => {
   const { descripcion, productoId, rating } = req.body;
   const { id: usuarioId } = req.usuario;

   // Validaciones de express-validator
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return next({ status: 400, errors });
   }

   // Si no hay errores, continúo
   const response = await createComentario(descripcion, usuarioId, productoId, rating);
   if (response.error) return next(response.error);

   res.status(201).json(response);
});


comentarioRouter.get("/", async (req, res, next) => {
   const response = await getAllComentarios();
   if (response.error) return next(response.error);

   res.json(response);
});

//obtener TODAS las reviews de un producto
comentarioRouter.get("/:productoId", async (req, res, next) => {
   const response = await getAllComentariosByProduct(req.params.productoId);
   if (response.error) return next(response.error);

   res.json(response);
});   


// obtener el rating promedio de 1 producto y la cantidad de veces que fue puntuado
comentarioRouter.get("/rating/:productoId", async (req, res, next) => {

   let sumaRating = 0
   let cantidadRating = 0
   let obj = {}
   const response = await getAllComentariosByProduct(req.params.productoId);

   if (response.length > 0) {
      for (let i = 0; i < response.length; i++) {
         sumaRating += response[i].rating
         cantidadRating += 1
      }
   
      obj = {
         ratingProm : sumaRating / cantidadRating,
         cantidadRating
      }

      res.status(200).json(obj)
   }else {
      obj = {
         ratingProm: null,
         cantidadRating: null
      }
      res.status(200).json(obj)
   }
   



   if (response.error) return next(response.error);

});

// @route PUT comments/:id
// @desc Actualiza un comentario existente
// @access Private
comentarioRouter.put('/:id', [
   check('descripcion', 'El campo "descripcion" es requerido y tiene un minimo de 10 caracteres y máximo 350').isString().trim().isLength({ min: 10, max: 350 }),
], async (req, res, next) => {
   // Validaciones de express-validator
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return next({ status: 400, errors });
   }

   // Si no hay errores, continúo
   const { descripcion } = req.body;
   const { id } = req.params;

   let put = await updateComentario(id, descripcion);
   if (put.error) return next(put.error);

   res.json(put);
})


// @route DELETE comments/:id
// @desc Elimina un comentario por id
// @access Private Admin
comentarioRouter.delete('/:id', async (req, res, next) => {
   const { id } = req.params;

   let destroy = await deleteComentario(id);
   if (destroy) return next(destroy.error);

   res.status(204).end();
})


module.exports = comentarioRouter;