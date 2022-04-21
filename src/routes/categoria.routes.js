const { Router } = require('express');
const { categoriaPost, getAllCategorias, categoriaUpdate, categoriaDelete } = require('../controllers/controllerCategorias');
const { check } = require('express-validator');
const categorRouter = Router();

// Requerimos los middlewares de autenticación
const { authentication, adminAuthentication } = require("../middlewares");


// @route POST categories/
// @desc Crear una nueva categoría
// @access Private Admin
categorRouter.post('/', [
   check('nombre', 'El campo nombre es requerido').trim().not().isEmpty()
],
    categoriaPost);


// @route GET categories/
// @desc Obtener todas las categorías con su información
// @access Public
categorRouter.get('/', getAllCategorias);


// @route UPDATE categories/
// @desc Actualizar una categoría por id recibido por body
// @access Private Admin
categorRouter.put('/update', [
   check('nombre', 'El campo nombre es requerido').trim().not().isEmpty(),
   check('id', 'El campo id es un valor numérico requerido').trim().not().isEmpty().isInt()
],  categoriaUpdate);


// @route DELETE categories/
// @desc Eliminar una categoría por id recibido por body
// @access Private Admin
categorRouter.delete('/delete', [
   check('id', 'El campo id es un valor numérico requerido').trim().not().isEmpty().isInt()
],  categoriaDelete);

module.exports = categorRouter;