const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const { Categoria } = require("../db");
const { validationResult } = require('express-validator');

async function categoriaPost(req, res, next) {
  try {
    // Validaciones de express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({ status: 400, errors });
    }

    // Si no hay errores, continúo
    const { nombre } = req.body;

    const valdidateact = await Categoria.findOne({
      where: {
        nombre: nombre,
      },
    });

    if (!valdidateact) {
      const addCateg = await Categoria.create({
        nombre: nombre,
      });
      return res.json(addCateg);
      // res.status(200).send({addCateg,
      //     status: 200,
      //     message: 'Data find Successfully'})

    }
    return next({
      status: 400,
      message: `Ya existe la Categoria '${nombre}'`,
    });

  } catch (error) {
    console.log(error)
    next({});
  }
}

async function categoriaUpdate(req, res, next) {
  try {
    // Validaciones de express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({ status: 400, errors });
    }

    // Si no hay errores, continúo
    const { id, nombre } = req.body;

    const UpdateCateg = await Categoria.update({
      nombre,
    },
      { where: { id } });


    if (!UpdateCateg) {
      return next({
        status: 404,
        message: 'No data found'
      });
    }
    res.json({
      message: 'Los datos se actualizaron correctamente'
    });

  } catch (error) {
    console.log(error)
    next({})
  }
}

async function getAllCategorias(req, res, next) {
  const { nombre } = req.query;

  try {
    if (!nombre) {
      // const ProductAll = await Producto.findAll({ include: Categoria });
      const CategAll = await Categoria.findAll({});

      if (!CategAll.length) return next({ status: 404, message: "Aún no hay categorías registradas" });

      res.json(CategAll);
    } else {
      const CategQuery = await Categoria.findAll({
        where: {
          nombre: {
            [Op.iLike]: `%${nombre}%`
          },
        },
        // include: Categoria
      });

      if (!CategQuery[0]) return next({
        status: 404,
        message: `No se encuentra ninguna Categoria con el nombre '${nombre}'`,
      });

      return res.json(CategQuery);
    }
  } catch (error) {
    console.log(err);
    next({});
  }
}

async function categoriaDelete(req, res, next) {
  try {
    // Validaciones de express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({ status: 400, errors });
    }

    // Si no hay errores, continúo
    const { id } = req.body;

    const UpdateCateg = await Categoria.destroy(
      { where: { id } });

    if (!UpdateCateg) {
      return next({
        status: 404,
        message: 'Categoría no encontrada'
      });
    }
    res.json({
      message: 'Los datos se borraron correctamente'
    });

  } catch (error) {
    console.log(error)
    next({})
  }
}


module.exports = {
  categoriaPost,
  getAllCategorias,
  categoriaUpdate,
  categoriaDelete
}