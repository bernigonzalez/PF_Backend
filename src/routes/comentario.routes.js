const { Router } = require("express");
const { createComentario, getAllComentarios, getAllComentariosByProduct, updateComentario, deleteComentario } = require("../controllers/controllerComentario");
const { authentication } = require("../middlewares");
const { check, validationResult } = require('express-validator');


const comentarioRouter = Router();

comentarioRouter.post("/", [
   check('descripcion', 'El campo descripcion es requerido').trim().not().isEmpty(),
   check('productoId', 'El campo productoId es un valor numérico requerido').trim().not().isEmpty().isInt()
], authentication, async (req, res, next) => {
   const { descripcion, productoId } = req.body;
   const { id: usuarioId } = req.usuario;

   // Validaciones de express-validator
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return next({ status: 400, errors });
   }

   // Si no hay errores, continúo
   const response = await createComentario(descripcion, usuarioId, productoId);
   if (response.error) return next(response.error);

   res.status(201).json(response);
});


comentarioRouter.get("/", async (req, res, next) => {
   const response = await getAllComentarios();
   if (response.error) return next(response.error);

   res.json(response);
});


comentarioRouter.get("/:productoId", async (req, res, next) => {
   const response = await getAllComentariosByProduct(req.params.productoId);
   if (response.error) return next(response.error);

   res.json(response);
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
