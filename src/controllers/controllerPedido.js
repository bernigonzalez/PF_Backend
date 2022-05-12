const { Pedido, LineaDePedido, Producto, Usuario } = require("../db");
const { Op } = require('sequelize');

const mapPedido = async (el) => {
   el = el.toJSON();

   // Cambio los nombres para que sean más intuitivos
   el.pedidoId = el.id;
   el.totalPedido = el.total;

   // Elimino los valores repetidos por el cambio de nombre
   delete el.id;
   delete el.total;

   let productosPedidos = await LineaDePedido.findAll({
      where: { pedidoId: el.pedidoId },
      // Hago un inner join del cual solo requiero el title y price
      include: {
         model: Producto,
         attributes: ["title", "price", "statusProduct"]
      },
   });

   // Mapeo los productos pedidos para ponerle nombres más adecuados y eliminar los repetidos
   productosPedidos = productosPedidos.map(e => {
      e = e.toJSON();
      e.producto = e.Producto.title;
      e.precioUnitario = e.Producto.price;
      e.status = e.Producto.statusProduct;
      e.pedidoId = e.id;
      e.statusProduct = e.Producto

      delete e.Producto;
      delete e.id;

      return e;
   });


   return { ...el, productos: productosPedidos };
};

module.exports = {
   createPedido: async (pedidos, userId) => {
      // El pedido que viene por body debería tener un array pedido con un objeto que contenga un idProducto y cantidad

      try {
         // Traigo todos los productos solicitados
         let productosPedidos = await Promise.all(pedidos.map((pedido) => {
            return Producto.findAll({
               // Me aseguro de que al menos haya un producto del solicitado (que esté en stock)
               attributes:
                  ["title", "price", "cantidad", "id"],
               where: {
                  [Op.and]: [
                     {
                        id: pedido.productoId
                     },
                     {
                        cantidad: {
                           [Op.gte]: 1
                        },
                     }
                  ]
               }
            })
         }));

         // Los filtro en caso de que algun producto solicitado no exista o no haya en stock
         let productosEncontrados = productosPedidos.filter(prod => prod.length !== 0);

         // Si ningún producto está en stock, le informo al usuario
         if (!productosEncontrados.length) return { error: { status: 400, message: "Ya no quedan productos en stock" } };

         productosEncontrados = productosEncontrados.map(prod => prod[0].toJSON());

         // Ahora voy a determinar si la cantidad requerida de ese producto alcanza con la existente sino le entrego todo lo que hay en stock
         let pedidoFinal = productosEncontrados.map(prod => {
            // Hallo la cantidad requerida del producto
            const cantidadRequerida = pedidos.find(el => parseInt(el.productoId) === prod.id).cantidad;
            const cantidad = cantidadRequerida <= prod.cantidad ? cantidadRequerida : prod.cantidad;
            return {
               ...prod,
               // Si la cantidad requerida es mayor a la existente, le entrego todo lo que tengo en stock
               cantidad,
               total: Math.round(cantidad * prod.price * 100) / 100
            }
         });

         // Calculo el valor total de la compra, para ello multiplico la cantidad de productos que vendo por el precio del producto
         let total = Math.round(pedidoFinal.reduce((prev, current) => (current.price * current.cantidad) + prev, 0) * 100) / 100;
           total = total >= 7000 ? total : total + 150
         // Ahora creo el pedido
         let pedidoAux = await Pedido.create({ usuarioId: userId, total, fechaCreacion: new Date() });
         let pedidoRealizado = pedidoAux.toJSON();

         // Ahora creo todas las líneas de pedidos
         await Promise.all(pedidoFinal.map((el) => {
            // Hallo la cantidad de productos que hay ahora sin los vendidos en el pedido actual y actualizo el stock en la DDBB
            const cantidadActual = productosEncontrados.find(bd => bd.id === el.id).cantidad;

            Producto.update(
               {
                  cantidad: cantidadActual - el.cantidad
               },
               {
                  where: {
                     id: el.id
                  }
               });

            return LineaDePedido.create({
               pedidoId: pedidoRealizado.id,
               productoId: el.id,
               cantidad: el.cantidad,
               total: el.total
            });
         }));

         return mapPedido(pedidoAux);
      } catch (error) {
         console.log(error);

         return { error: {} }
      }
   },

   getAllPedidos: async (desde, hasta) => {
      try {
         let pedidos;
         if (!desde && !hasta) {
            pedidos = await Pedido.findAll({
               // Incluyo también la información del usuario para que se pueda realizar el envío, etc
               include: {
                  model: Usuario,
                  // No me interesa toda la info del usuario, solo la de contacto y direccion
                  attributes: ["id", "nombre", "email", "telefono", "pais", "direccion", "provincia"]
               }
            });
         } else {

            if (!desde || !hasta) return { error: { status: 400, message: "Para filtrar por fecha debe poner tanto una fecha de inicio (desde) como de fin (hasta)" } };

            // Si tengo una fecha de inicio y fin filtro los pedidos que estén en esas fechas
            pedidos = await Pedido.findAll({
               // Incluyo también la información del usuario para que se pueda realizar el envío, etc
               include: {
                  model: Usuario,
                  // No me interesa toda la info del usuario, solo la de contacto y direccion
                  attributes: ["id", "nombre", "email", "telefono", "pais", "direccion", "provincia"]
               }, where: {
                  // Agrego las restricciones de filtrado por fecha
                  fechaCreacion: {
                     [Op.between]: [new Date(desde), new Date(hasta)],
                  }
               }
            });
         }

         if (!pedidos.length) {
            if (desde && hasta) return { error: { status: 404, message: "No hay pedidos registrados en este periodo" } };

            return { error: { status: 404, message: "No hay pedidos registrados" } };
         } else {
            pedidos = await Promise.all(pedidos.map(mapPedido));

            // Le cambio de nombre y quito algunos campos a cada pedido
            pedidos = pedidos.map(pedido => {
               pedido.usuario = pedido.Usuario;
               // Le quito campos que está repetidos
               delete pedido.usuarioId;
               delete pedido.Usuario;

               return pedido;
            });

            return pedidos;
         }
      } catch (error) {
         console.log(error);
         return { error: {} }
      }
   },

   getPedidosByUsuario: async (userId) => {
      try {
         const user = await Usuario.findByPk(userId);

         if (!user) return { error: { status: 400, message: "Usuario no válido" } };

         let pedidos = await Pedido.findAll({
            where: {
               usuarioId: userId,
            }
         });

         if (!pedidos.length) {
            return { status: 404, message: "No tiene pedidos registrados" };
         } else {
            return await Promise.all(pedidos.map(pedido => mapPedido(pedido)));
         }
      } catch (error) {
         console.log(error);
         return { error: {} }
      }
   },

   getPedidosById: async (pedidoId) => {
      try {
         let pedido = await Pedido.findByPk(pedidoId);

         if (!pedido) return { error: { status: 404, message: "Pedido no encontrado" } };

         return await mapPedido(pedido);
      } catch (error) {
         console.log(error);
         return { error: {} }
      }
   },

   updateStatusPedido: async (idPedido, newStatus) => {
      try {
         await Pedido.update({
            status: newStatus
         }, {
            where: {
               id: idPedido
            }
         });

         return "Pedido actualizado correctamente";
      } catch (error) {
         console.log(error);
         return { error: {} }
      }
   },

   deletePedido: async (id, userIdToken) => {
      try {
         let pedido = await Pedido.findByPk(id);

         if (!pedido) return { error: { status: 404, message: "Ningún pedido coincide con el id proporcionado" } };

         pedido = pedido.toJSON();

         if (pedido.pagado === true) return { error: { status: 400, message: "No puede eliminar un pedido que ya está pagado" } };

         let user = await Usuario.findByPk(userIdToken);
         user = user.toJSON();

         // console.log(user);

         // Valido que sea el usuario propietario del pedido o el administrador
         if (user.id !== pedido.usuarioId && user.rol !== "2") return { error: { status: 403, message: "No está autorizado para realizar esta acción" } };

         // Traigo todas las líneas de pedido que pertenezcan a ese pedido para devolver los productos al stock y eliminar las lineas
         const lineasPedido = await LineaDePedido.findAll({ where: { pedidoId: id } });
         await Promise.all(lineasPedido.map(async (e) => {
            // Lo paso a JSON para tener solo los valores útiles
            e.toJSON();

            // console.log(e);

            // Traigo el producto para obtener su cantidad y luego poder devolver los productos pedidos
            let producto = await Producto.findByPk(e.productoId);
            producto = producto.toJSON();

            // Actualizo el producto sumandole la cantidad que había reservado para el pedido
            await Producto.update({
               cantidad: producto.cantidad + e.cantidad
            }, {
               where: { id: e.productoId }
            });

            // Luego tengo que eliminar la línea de pedido
            await LineaDePedido.destroy({ where: { id: e.id } });
         }));

         // Ya que se eliminaron todas las lineas de pedido, elimino finalmente el pedido

         await Pedido.destroy({ where: { id } });

         return {};
      } catch (err) {
         console.log(err);

         return { error: {} };
      }
   }
};
