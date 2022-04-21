const { Router } = require('express');
const { getAllOfertas, createOferta, updateOferta, deleteOferta, getOfertaById, getOfertasActivas, removeProducto, addProducto } = require('../controllers/controllerOfertas');
const { check, validationResult } = require('express-validator');

const offersRouter = Router();

// Requerimos los middlewares de autenticación
const { authentication, adminAuthentication } = require("../middlewares");
const { ACTIVA, INACTIVA } = require('../data/constantes');


offersRouter.get('/', async (req, res, next) => {
     try {
          let result = await getAllOfertas();

          if (result.error) return next(result.error);

          res.send(result);
     } catch (err) {
          console.log(err);
          res.status(500).end();
     }
})


offersRouter.get('/active', async (req, res, next) => {
     try {
          let result = await getOfertasActivas();

          if (result.error) return next(result.error);

          res.send(result);
     } catch (err) {
          console.log(err);
          res.status(500).end();
     }
})


offersRouter.get('/:id', async (req, res, next) => {
     try {
          const { id } = req.params;

          const result = await getOfertaById(id);

          if (result.error) return next(result.error);

          res.send(result);
     } catch (err) {
          console.log(err);
          res.status(500).end();
     }
})


offersRouter.post('/', [
     check('titulo', 'El campo "titulo" es requerido').isString().trim().not().isEmpty(),
     check('descripcion', 'El campo "descripcion" es requerido y tiene un minimo de 10 caracteres y máximo 250').isString().trim().isLength({ min: 10, max: 250 }),
     check('porcentajeDescuento', 'El campo "porcentajeDescuento" es requerido y debe ser un número entero entre 1 y 100').not().isEmpty().isInt({ min: 1, max: 100 }),
     check('productos', 'El campo productos es requerido y debe ser un array con la forma [{id: 1, cantidad: 2}]').isArray({ min: 1 }).custom(productos => {
          let res;
          res = productos.filter(e => {
               return (typeof e !== "object") || !e.id || !e.cantidad;
          })

          return res.length === 0;
     }),
],  async (req, res, next) => {
     // Validaciones de express-validator
     const errors = validationResult(req);

     if (!errors.isEmpty()) {
          return next({ status: 400, errors });
     }

     // Si no hay errores, continúo
     try {
          const { titulo, descripcion, porcentajeDescuento, productos } = req.body;

          let result = await createOferta(titulo, descripcion, porcentajeDescuento, productos);

          if (result.error) return next(result.error);

          res.json(result);
     } catch (err) {
          console.log(err);
          res.status(500).end();
     }
})


// Esta ruta me permite cambiar el titulo, descripcion, porcentajeDescuento o estado
// De los productos de esta oferta no me deja modificar mas que la cantidad
// Si no le paso productos funciona igual
offersRouter.put('/:id', [
     check('titulo', 'El campo "titulo" es requerido').isString().trim().not().isEmpty(),
     check('descripcion', 'El campo "descripcion" es requerido y tiene un minimo de 10 caracteres y máximo 250').isString().trim().isLength({ min: 10, max: 250 }),
     check('porcentajeDescuento', 'El campo "porcentajeDescuento" es requerido y debe ser un número entero entre 1 y 100').not().isEmpty().isInt({ min: 1, max: 100 }),
     check('estado', 'El campo "estado" es requerido y puede tomar los valores de "ACTIVA" o "INACTIVA"').trim().custom(value => [ACTIVA, INACTIVA].includes(value)).optional(),
     check('productos', 'El campo productos es requerido y debe ser un array con la forma [{id: 1, cantidad: 2}]').isArray({ min: 1 }).custom(productos => {
          let res;
          res = productos.filter(e => {
               return (typeof e !== "object") || !e.id || !e.cantidad;
          })

          return res.length === 0;
     }).optional(),
],  async (req, res, next) => {
     // Validaciones de express-validator
     const errors = validationResult(req);

     if (!errors.isEmpty()) {
          return next({ status: 400, errors });
     }

     // Si no hay errores, continúo
     try {
          const { titulo, descripcion, porcentajeDescuento, estado, productos } = req.body;
          const { id } = req.params;

          let result = await updateOferta(
               id,
               titulo,
               descripcion,
               porcentajeDescuento,
               estado,
               productos
          );

          if (result.error) return next(result.error);

          res.json(result);
     } catch (err) {
          console.log(err);
          res.status(500).end();
     }
})


offersRouter.put('/add/:ofertaId', [
     check('producto', 'El campo producto es requerido y debe ser un objeto de la forma {id: 1, cantidad: 2}').isObject().custom(e => {
          return e.id && e.cantidad;
     }),
], async (req, res, next) => {
     // Validaciones de express-validator
     const errors = validationResult(req);

     if (!errors.isEmpty()) {
          return next({ status: 400, errors });
     }

     // Si no hay errores, continúo
     try {
          const { producto } = req.body;
          const { ofertaId } = req.params;

          let result = await addProducto(ofertaId, producto);

          if (result.error) return next(result.error);

          res.json(result);
     } catch (err) {
          console.log(err);
          res.status(500).end();
     }
})


offersRouter.put('/remove/:ofertaId', [
     check('productoId', 'El campo productoId es un valor numérico requerido').trim().not().isEmpty().isInt({ min: 1 }),
],  async (req, res, next) => {
     // Validaciones de express-validator
     const errors = validationResult(req);

     if (!errors.isEmpty()) {
          return next({ status: 400, errors });
     }

     // Si no hay errores, continúo
     try {
          const { productoId } = req.body;
          const { ofertaId } = req.params;

          let destroy = await removeProducto(ofertaId, productoId);

          if (destroy) return next(destroy.error);

          res.status(204).end();
     } catch (err) {
          console.log(err);
          res.status(500).end();
     }
})


offersRouter.delete('/:id',  async (req, res, next) => {
     try {
          const { id } = req.params;

          let destroy = await deleteOferta(id);

          if (destroy) return next(destroy.error);

          res.status(204).end();
     } catch (err) {
          console.log(err);
          res.status(500).end();
     }
})


module.exports = offersRouter
