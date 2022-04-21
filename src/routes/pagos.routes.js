const { Router } = require('express');
const { pagosPost } = require('../controllers/controllerPagos')
const pagoRouter = Router();
const { check } = require('express-validator');

// Requerimos los middlewares de autenticación
const { authentication } = require("../middlewares");


// @route POST categories/
// @desc Crear una nueva categoría
// @access Private Admin
//pagoRouter.post('/', authentication, adminAuthentication, pagosPost);
pagoRouter.post('/', [
   check('pedidoId', 'El campo id es un valor numérico requerido').trim().not().isEmpty().isInt(),
   check('transaccionId', 'El campo id es un valor numérico requerido').isString().trim()
], pagosPost);

module.exports = pagoRouter;