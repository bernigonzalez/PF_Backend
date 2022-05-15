const { Router } = require("express");
const { carritoPost, carritoGet, deleteCarrito, deleteFromCarrito, addToCarrito } = require("../controllers/controllerCarrito");
const authentication = require("../middlewares/authentication");
const carritoRouter = Router();

carritoRouter.post("/", authentication, carritoPost);


carritoRouter.get("/:usuarioId", authentication, carritoGet);


//! Elimina un producto del carrito, independientemente de la cantidad de unidades que tenga
carritoRouter.put("/delete", authentication, async (req, res, next) => {
   const { carritoId, productoId } = req.body;

   const destroy = await deleteFromCarrito(carritoId, productoId);
   if (destroy.error) return next(destroy.error);

   res.json(destroy);
});


//! Permite agregar un nuevo producto a un carrito o actualizar la cantidad de uno existente
carritoRouter.put("/add", authentication, async (req, res, next) => {
   const { carritoId, productoId, cantidad } = req.body;

   const updated = await addToCarrito(carritoId, productoId, cantidad);
   if (updated.error) return next(updated.error);

   res.json(updated);
});


//! Elimina el carrito por completo junto con TODOS los productos que tenga
carritoRouter.delete("/:usuarioId", authentication, async (req, res, next) => {
   const destroy = await deleteCarrito(req.params.usuarioId);
   if (destroy.error) return next(destroy.error);

   res.json(destroy);
});


module.exports = carritoRouter;