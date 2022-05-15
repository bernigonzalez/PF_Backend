const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const { Producto, Categoria } = require('../db')
const { validationResult } = require('express-validator');

const mapProduct = (foundedProduct) => {
  foundedProduct = foundedProduct.toJSON()
  if (foundedProduct.categoriaId) {
    delete foundedProduct.categoriaId;
    let category = foundedProduct.Categorium.nombre;
    foundedProduct.category = category;
  }
  delete foundedProduct.Categorium;
  return foundedProduct;
}

async function getAllProductos(title) {
  try {
    if (!title) {
      // const ProductAll = await Producto.findAll({ include: Categoria });
      let productAll = await Producto.findAll(
        {
          include: Categoria
        });
      productAll = productAll.map(prod => mapProduct(prod));

      return productAll;
    } else {
      const ProductQuery = await Producto.findAll({
        where: {
          title: {
            [Op.iLike]: `%${title}%`
          },
        },
        include: Categoria
      });

      if (!ProductQuery[0]) {
        return {
          error: {
            status: 404,
            message: `No se encuentra ningun Producto con el nombre '${title}'`
          }
        };
      }

      ProductQuery.map(prod => mapProduct(prod));
      return ProductQuery;
    }
  } catch (error) {
    console.log(error);
    return { error: {} };
  }
}


const getProductoById = async (id) => {
  try {
    let foundedProduct = await Producto.findByPk(id, {
      include: {
        model: Categoria,
        required: false,
        attributes: ["nombre"]
      }
    });

    if (!foundedProduct) return { error: { status: 404, message: "Producto no encontrado" } };

    return mapProduct(foundedProduct);
  } catch (e) {
    console.log(e);
    return { error: {} };
  }
}


const getAllProductosByCategory = async (categoriaId) => {
  try {
    let category = await Categoria.findByPk(categoriaId, {
      attributes: ["nombre"]
    });

    if (!category) return { error: { status: 400, message: "No existe la categoría especificada" } };

    let foundedProducts = await Producto.findAll({ where: { categoriaId } });

    if (!foundedProducts.length) return { error: { status: 404, message: "Ningún producto pertenece a esta categoría" } };

    foundedProducts = foundedProducts.map(el => {
      prod = el.toJSON();
      prod.category = category.nombre;
      delete prod.categoriaId;

      return prod;
    });

    return foundedProducts;
  } catch (e) {
    console.log(e);
    return { error: {} };
  }
}


const postProducto = async (title, price, description, size, categoriaId, images, cantidad) => {
  try {
    let exist = await Producto.findOne({ where: { title } });

    if (exist) return { error: { status: 400, message: `Ya existe un producto con ese nombre: '${title}'` } };

    let createProduct = await Producto.create({
      title,
      price,
      description,
      size,
      categoriaId,
      images,
      cantidad
    });

    return createProduct;

  } catch (error) {
    console.log(error);
    return { error: {} };
  }
}

const putProducto = async (title, price, description, category, image, cantidad, id) => {
  try {
    console.log("category es:", category)
    let update = await Producto.update(

      {
        title: title,
        price: price,
        description: description,
        categoriaId: category, //categoryId almacena el id de la categoría a la que pertenece
        image: image,
        cantidad: cantidad
      },
      { where: { id } })
    return "Success update";

  } catch (error) {
    console.log(error)
    return { error: {} };
  }
}

const deleteProducto = async (id) => {
  try {
    let dest = await Producto.findByPk(id);

    if (!dest) return { error: { status: 404, message: "Id no válido" } };

    // console.log(id)
    dest = await Producto.destroy({
      where: { id }
    })

    return;
  } catch (error) {
    console.log(error);
    return { error: {} }
  }
}

async function updateRateProducto(req, res, next) {
  try {
    // Validaciones de express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({ status: 400, errors });
    }

    // Si no hay errores continúo
    const { id, rate } = req.body;

    let producto = await Producto.findByPk(id);

    if (!producto) return next({ status: 400, message: "El id del producto no es válido" });
    // Lo paso a JSON para tener solo los datos que me interesan
    producto = producto.toJSON();

    // console.log(producto);

    let rateAll = (producto.count * producto.rate);
    let newCount = producto.count + 1;
    console.log(producto);
    console.log("Sumatoria rates: " + rateAll)
    console.log("Nuevo Count: " + newCount)
    // Actualizo el producto
    await Producto.update({
      // Para que solo tenga un decimal (cuando es la primera calificación no debe promediarse)

      rate: parseInt(producto.count) === 0 ?
        rate :
        Math.round(((rate + rateAll) / newCount) * 100) / 100,
      count: newCount
    },
      { where: { id } });

    res.json({
      message: 'Los datos se actualizaron correctamente'
    });

  } catch (error) {
    console.log(error)
    next({})
  }
}

const disabledEnabledProduct = async (id) => {
  try {
    let prod = await Producto.findByPk(id);

    if (!prod) return { error: { status: 404, message: "Id no válido" } };

    // console.log(id)

    const statusProduct = prod?.dataValues.statusProduct;
    if(statusProduct===false){
      prod = await Producto.update(
        {statusProduct:false},
        {where: { id }
      })
    }else{
      prod = await Producto.update(
        {statusProduct:true},
        {where: { id }
      })
    }
   

    return;
  } catch (error) {
    console.log(error);
    return { error: {} }
  }
}



module.exports = {
  getAllProductos,
  getProductoById,
  postProducto,
  deleteProducto,
  putProducto,
  getAllProductosByCategory,
  updateRateProducto,
  disabledEnabledProduct
}


