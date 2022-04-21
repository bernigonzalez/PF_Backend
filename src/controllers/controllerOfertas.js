const { ACTIVA } = require("../data/constantes");
const { Ofertas, OfertaProducto, Producto } = require('../db')
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getOfertaById = async (id) => {
  let oferta = await Ofertas.findByPk(id, {
    include: {
      model: OfertaProducto,
      attributes: ["productoId", "cantidad"]
    },
  });

  if (!oferta) return { error: { status: 404, message: "Oferta no encontrada" } };

  return oferta;
}


const getAllOfertas = async () => {
  let get = await Ofertas.findAll({
    include: {
      model: OfertaProducto,
      attributes: ["productoId", "cantidad"]
    }
  });
  console.log(get);
  return get
}


const getOfertasActivas = async () => {
  let get = await Ofertas.findAll({
    include: {
      model: OfertaProducto,
      attributes: ["productoId", "cantidad"]
    },
    where: { estado: ACTIVA }
  });
  console.log(get);
  return get
}


const createOferta = async (titulo, descripcion, porcentajeDescuento, productos) => {
  try {
    let exist = await Ofertas.findOne({ where: { titulo } });

    if (exist) return { error: { status: 400, message: `Ya existe una oferta con el titulo ${titulo}` } };

    // Valido que todos los productos que se van a poner en promoción existan y que alcance la cantidad dada
    productos = await Promise.all(productos.map(async (prod) => {
      let producto = await Producto.findByPk(prod.id);
      if (!producto) return;

      producto = producto.toJSON();
      if (producto.cantidad < 1) return;

      // Si hay menos productos en stock de los que estan para oferta, le entrego todo el stock
      prod.cantidad = prod.cantidad <= producto.cantidad ? prod.cantidad : producto.cantidad;

      return prod;
    }));

    // console.log(productos);

    productos = productos.filter(prod => prod);


    if (!productos.length) return {
      error: { status: 400, message: "No hay suficientes productos en stock" }
    };

    // Creamos la oferta
    let ofertaCreada = await Ofertas.create({
      titulo,
      descripcion,
      porcentajeDescuento,
      // El estado es por defecto ACTIVO
    });
    ofertaCreada = ofertaCreada.toJSON();

    // Creo las relaciones entre oferta - producto con la instancia OfertaProducto
    await Promise.all(productos.map(async (prod) => {
      await OfertaProducto.create({
        productoId: prod.id,
        ofertaId: ofertaCreada.id,
        cantidad: prod.cantidad
      });
    }));

    return ofertaCreada;
  } catch (error) {
    console.log(error);
    return { error: {} };
  }
}

const updateOferta = async (id, titulo, descripcion, porcentajeDescuento, estado, productos) => {
  try {

    let oferta = await Ofertas.findOne({ where: { titulo } });

    if (oferta) return { error: { status: 400, message: "Ya existe una oferta con ese nombre" } };

    let updated = await Ofertas.update(
      {
        titulo,
        descripcion,
        porcentajeDescuento,
        estado,
      },
      { where: { id } });

    if (updated[0] === 0) return { error: { status: 404, message: "Oferta no encontrada" } };

    if (productos) {
      // Valido que todos los productos que se van a poner en promoción existan y que alcance la cantidad dada
      productos = await Promise.all(productos.map(async (prod) => {
        let producto = await Producto.findByPk(prod.id);
        if (!producto) return;

        producto = producto.toJSON();
        if (producto.cantidad < 1) return;

        // Si hay menos productos en stock de los que estan para oferta, le entrego todo el stock
        prod.cantidad = prod.cantidad <= producto.cantidad ? prod.cantidad : producto.cantidad;

        return prod;
      }));

      productos = productos.filter(prod => prod);

      if (!productos.length) return {
        error: { status: 400, message: "No hay suficientes productos en stock" }
      };

      // Creo las relaciones entre oferta - producto con la instancia OfertaProducto
      await Promise.all(productos.map(async (prod) => {
        await OfertaProducto.update({
          cantidad: prod.cantidad
        }, { where: { productoId: prod.id } });
      }));
    }

    return { message: "Actualización exitosa" };
  } catch (error) {
    console.log(error);
    return { error: {} };
  }
}


const addProducto = async (ofertaId, producto) => {

  try {
    const oferta = await Ofertas.findByPk(ofertaId);
    if (!oferta) return { error: { status: 404, message: "Oferta no encontrada" } };

    const productoExists = await Producto.findByPk(producto.id);
    if (!productoExists) return { error: { status: 404, message: "Producto no encontrado" } };

    const exists = await OfertaProducto.findOne({
      where: {
        [Op.and]: [
          {
            productoId: producto.id
          },
          {
            ofertaId
          }
        ]
      }
    });

    if (exists) return { error: { status: 400, message: "El producto ya está incluido en la oferta actual" } };

    const created = await OfertaProducto.create({
      productoId: producto.id,
      cantidad: producto.cantidad || 5,
      ofertaId
    });

    return created;
  } catch (error) {
    console.log(error);
    return { error: {} };
  }
}


const removeProducto = async (ofertaId, productoId) => {
  try {
    const oferta = await Ofertas.findByPk(ofertaId);

    console.log(oferta);
    if (!oferta) return { error: { status: 404, message: "Oferta no encontrada" } };

    const exists = await OfertaProducto.destroy({
      where: {
        [Op.and]: [
          {
            productoId
          },
          {
            ofertaId
          }
        ]
      }
    });

    if (!exists) return { error: { status: 404, message: "Producto no encontrado en la oferta actual" } };

    return;
  } catch (error) {
    console.log(error);
    return { error: {} };
  }
}


const deleteOferta = async (id) => {
  try {
    let deleted = await Ofertas.destroy({
      where: { id }
    });

    if (!deleted) return { error: { status: 404, message: "Id de la oferta no es válido" } };

    // Traigo todas las ofertasProducto
    let ofertaProductos = await OfertaProducto.findAll({ where: { ofertaId: id } });

    // Voy por cada ofertaProducto y las elimino
    await Promise.all(ofertaProductos.forEach(async (el) => {
      el = el.toJSON();
      await OfertaProducto.destroy({ where: { id: el.id } });
    }));

    return {};
  } catch (error) {
    console.log(error);
    return { error: {} }
  }
}


module.exports = {
  getAllOfertas,
  createOferta,
  updateOferta,
  deleteOferta,
  getOfertaById,
  getOfertasActivas,
  addProducto,
  removeProducto
}