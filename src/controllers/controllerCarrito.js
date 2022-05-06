const { Carrito, CarritoDetalle } = require("../db");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

async function carritoPost(req, res, next) {
  try {
    const { id: usuarioId } = req.usuario;

    const nuevoCarrito = await Carrito.findOrCreate({
            where:{usuarioId }
        });

    return res.status(201).json(nuevoCarrito);

  } catch (error) {
    console.log(error);
    return next({});
  }
}

async function carritoGet(req, res, next) {
  const { usuarioId } = req.params;
  if (!usuarioId) {
    return res.status(400).json({ message: "data are requerid" });
  }
  try {
    const carrito = await Carrito.findOne({
      include: [CarritoDetalle],
      where: { usuarioId },
    });
    if (carrito) {
      return res.status(200).json(carrito);
    } else {
      return next({ status: 404, message: "Carrito not founded" });
    }
  } catch (error) {
    console.log(error);
    return next({});
  }
}


// UPDATE PRODUCTO IN CARRITO
// Si no existe el producto en el carrito lo crea y le pone la cantidad por default o la que se le pase
// Si ya existe el producto en el carrito, cambia la cantidad anterior por la nueva cantidad
const addToCarrito = async (carritoId, productoId, cantidad = 1) => {
  try {
    const producto = await CarritoDetalle.findOne({
      where: {
        [Op.and]: [
          {
            productoId
          },
          {
            carritoId
          }
        ]
      }
    });

    // Si ya está el producto le actualizo a la cantidad indicada
    if (!producto) {
      try {
        await CarritoDetalle.findOrCreate({
          where: {
            productoId,
            carritoId,
            cantidad
          },
          defaults: { cantidad },
        });
      } catch (error) {
        return { error: { status: 400, message: "Parámetros erróneos" } };
      }
    } else {
      await CarritoDetalle.update({
        cantidad
      },
        {
          where: {
            [Op.and]: [
              {
                productoId
              },
              {
                carritoId
              }
            ]
          }
        });
    }

    return "Actualización exitosa";
  } catch (error) {
    console.log(error);
    return { error: { status: 500, message: "No ha sido posible actualizar el producto" } };
  }
}

// Elimina todo el carrito y sus CarritoDetalle relacionados
const deleteCarrito = async (usuarioId) => {
  try {
    let carrito = await Carrito.findOne({ where: { usuarioId } });

    if (!carrito) {
      return { error: { status: 404, message: "Carrito no encontrado" } };
    }

    carrito = carrito.toJSON();

    // Elimino los productos -> CarritoDetalles
    await CarritoDetalle.destroy({ where: { carritoId: carrito.id } });

    // Elimino el carrito en sí
    await Carrito.destroy({ where: { usuarioId } });
    return "Eliminación exitosa";
  } catch (error) {
    console.log(error);
    return { error: { status: 400, message: "No ha sido posible eliminar el carrito" } };
  }
}


// Elimina un producto del carrito independientemente de la cantidad que tenga
const deleteFromCarrito = async (carritoId, productoId) => {
  try {
    const producto = await CarritoDetalle.findOne({
      where: {
        [Op.and]: [
          {
            productoId
          },
          {
            carritoId
          }
        ]
      }
    });

    if (!producto) {
      return { error: { status: 404, message: "Producto no encontrado" } };
    }

    await CarritoDetalle.destroy({
      where: {
        [Op.and]: [
          {
            productoId
          },
          {
            carritoId
          }
        ]
      }
    });

    return "Actualización exitosa";
  } catch (error) {
    console.log(error);
    return { error: { status: 500, message: "No ha sido posible actualizar el producto" } };
  }
}


module.exports = {
  carritoPost,
  carritoGet,
  deleteCarrito,
  deleteFromCarrito,
  addToCarrito
};
