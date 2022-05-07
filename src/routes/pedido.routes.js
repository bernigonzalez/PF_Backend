const { Router } = require('express');
const { getAllPedidos, getPedidosByUsuario, createPedido, updateStatusPedido, deletePedido, getPedidosById } = require('../controllers/controllerPedido');
const { Usuario ,Pedido} = require('../db');
const pedidoRouter = Router();
const { check, validationResult } = require('express-validator');

// Requerimos los middlewares de autenticación
const { authentication, adminAuthentication } = require("../middlewares");
const {PENDIENTE , ENPROCESO ,ENVIADO, ENTREGADO , RECHAZADO} = require("../data/constantes");


// @route GET pedidos/
// @desc Obtener todos los pedidos realizados o filtrar por fecha si se especifica
// @access Private Admin
pedidoRouter.get('/',
   
   async (req, res, next) => {
      const { desde, hasta } = req.query;

      let get = await getAllPedidos(desde, hasta);
      if (get.error) return next(get.error);

      return res.json(get);
   }
)


// @route GET pedidos/user/:userId
// @desc Obtener todos los pedidos que ha realizado un usuario
// @access Private
pedidoRouter.get('/user/:userId', authentication,
   
   async (req, res, next) => {
      const { userId } = req.params;

      // Traigo el usuario que me proporcionó el token
      let user = await Usuario.findByPk(req.usuario.id);
     /*  user = user.toJSON(); */
     user && (user = user.toJSON());

      // Le permito el acceso si el usuario es el propietario del token o es admin
      if (req.usuario.id === parseInt(userId) || user.rol == "2") {
         let get = await getPedidosByUsuario(userId);
         if (get.error) return next(get.error);
         return res.json(get);
      }

      next({ status: 403, message: "No está autorizado para esta acción" });
   }
)

// FALTA AÑADIR SEGURIDAD
// @route GET pedidos/pedidoId
// @desc Obtener un pedido por id
// @access Private
pedidoRouter.get('/:pedidoId',
   
   async (req, res, next) => {
      const { pedidoId } = req.params;

      let get = await getPedidosById(pedidoId);
      if (get.error) return next(get.error);

      return res.json(get);
   }
)


// @route POST pedidos/
// @desc Realizar un pedido
// @access Private
pedidoRouter.post('/',  authentication, [
   check('pedidos', 'El campo "pedidos" es requerido y debe ser un array con la forma [{productoId: 1, cantidad: 2}]').isArray({ min: 1 }).custom(pedidos => {
      let res;
      res = pedidos.filter(e => {
         return (typeof e !== "object") || !e.productoId || !e.cantidad;
      })

      return res.length === 0;
   })
],
   
   async (req, res, next) => {
      // Validaciones de express-validator
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return next({ status: 400, errors });
      }

      // Si no hay errores, continúo
      const { pedidos } = req.body;

      if (pedidos) {
         let get = await createPedido(pedidos, req.usuario.id);

         if (get.error) return next(get.error);

         return res.json(get);
      }

      res.status(400).end();
   }
);


// @route PUT pedidos/:idPedido
// @desc Actualizar el estado de un pedido
// @access Private Admin
pedidoRouter.put('/:pedidoId', [
   check('status', `El campo "status" es requerido y debe ser igual a ${PENDIENTE} o ${ENVIADO} o ${ENPROCESO} o ${ENTREGADO} o ${RECHAZADO}`).isString().trim().custom(status =>
      [PENDIENTE, ENVIADO ,ENPROCESO, ENTREGADO , RECHAZADO].includes(status)
   ),
],
   
   async (req, res, next) => {
      // Validaciones de express-validator
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return next({ status: 400, errors });
      }

      // Si no hay errores, continúo
      const { pedidoId } = req.params;
      const { status } = req.body;

      let get = await updateStatusPedido(pedidoId, status);

      if (get.error) return next(get.error);

      return res.json(get);
   }
);
 pedidoRouter.post('/update' , async (req ,res) => {
   const {idPedido , status} = req.body
   console.log(idPedido , status)
   try {
    const statusUpdate =  await Pedido.update({
         pagado: status
      }, {
         where: {
            id: idPedido
         }
      });

     res.status(200).json(statusUpdate)
   } catch (error) {
      console.log(error);
     res.status(404).send('pedido no encontrado')
   }
})



// @route PUT pedidos/:idPedido
// @desc Actualizar el estado de un pedido
// @access Private Admin
pedidoRouter.delete('/:pedidoId', async (req, res, next) => {
   const { pedidoId } = req.params;

   const deleted = await deletePedido(pedidoId, req.usuario.id);

   if (deleted.error) return next(deleted.error);

   res.status(204).end();
})

module.exports = pedidoRouter;