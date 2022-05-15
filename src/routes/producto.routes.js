const { Router } = require('express');
const { updateRateProducto, getAllProductos, getAllProductosByCategory, getProductoById, postProducto, deleteProducto, putProducto, getAllProductosAndDisabled, disabledEnabledProduct } = require('../controllers/controllerProduct')
const productRouter = Router();
const {Producto} = require('../db')
const { check, validationResult } = require('express-validator');

// Requerimos el middleware de autenticación
const { authentication, adminAuthentication } = require("../middlewares");

// @route GET products/:id
// @desc Obtener la información de un producto por id
// @access Public
productRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    let get = await getProductoById(id);
    if (get.error) return next(get.error);

    res.json(get);

})


// @route GET products/
// @desc Obtener la información de todos los productos
// @access Public
productRouter.get('/', async (req, res, next) => {
    let { title = null } = req.query;

    const get = await getAllProductos(title);
    if (get.error) return next(get.error);

    res.json(get);
});


// @route GET products/category/:categoryId
// @desc Obtener la información de todos los productos de una categoria
// @access Public
productRouter.get('/category/:categoriaId', async (req, res, next) => {
    let { categoriaId } = req.params;

    const get = await getAllProductosByCategory(categoriaId);
    if (get.error) return next(get.error);

    res.json(get);
});


// TRABAJO JOHAN
// @route POST products/
// @desc Crear un nuevo producto con la información raída por body
// @access Private Admin
productRouter.post('/', /*[
    check('title', 'El campo "titulo" es requerido').isString().trim().not().isEmpty(),
    check('images', 'El campo "image" es requerido').isArray().trim().not().isEmpty(),
    check('description', 'El campo "description" es requerido y tiene un minimo de 10 caracteres y máximo 250').isString().trim().isLength({ min: 10, max: 250 }),
    check('price', 'El campo "price" es requerido y debe ser un número').not().isEmpty().isNumeric({ min: 1 }),
    check('category', 'El campo "category" es requerido y debe ser un id').isString(),isInt({ min: 1 }),/
    check('cantidad', 'El campo "cantidad" es requerido y debe ser un número entero').isInt({ min: 1 }),
],*/  async (req, res, next) => {
        // Validaciones de express-validator
        /*const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next({ status: 400, errors });
        }*/

        // Si no hay errores, continúo
        const { title, price, description, size, categoriaId, images, cantidad } = req.body

        let post = await postProducto(title, price, description, size, categoriaId, images, cantidad);
        if (post.error) return next(post.error);

        res.status(201).json(post);
    })

// @route PUT productos/rate
// @desc Actualizar el rate y count de un producto con id recibido por body
// @access Private Usuario
productRouter.put('/rate', [
    check('rate', 'El campo "rate" es requerido y debe ser un número entero o flotante entre 0 y 5').isFloat({ min: 0, max: 5 }),
    check('id', 'El campo "id" es requerido y debe ser un número entero').isInt({ min: 1 }),
], authentication, updateRateProducto);


// @route PUT products/:id
// @desc Actualiza un nuevo producto por id
// @access Private Admin
productRouter.put('/:id', [
    check('title', 'El campo "titulo" es requerido').isString().trim().not().isEmpty(),
    check('description', 'El campo "description" es requerido y tiene un minimo de 10 caracteres ').isString().trim().isLength({ min: 10}),
    check('price', 'El campo "price" es requerido y debe ser un número').not().isEmpty().isNumeric({ min: 1 }),
    check('cantidad', 'El campo "cantidad" es requerido y debe ser un número entero').isInt({ min: 0 }),
], async (req, res, next) => {
    // Validaciones de express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("body;", req.body)
        console.log("vine con errores del front")
        return next({ status: 400, errors });
    }

    // Si no hay errores, continúo
    const { title, price, description, category, image, cantidad } = req.body;
    const { id } = req.params;

    let put = await putProducto(title, price, description, category, image, cantidad, id);
    if (put.error) return next(put.error);

    res.json(put);
})

productRouter.put('/changeStatus/:id',async (req,res,next)=>{
    const {id} = req.params;

    try {
        let prod = await Producto.findByPk(id);
    
        if (!prod) return { error: { status: 404, message: "Id no válido" } };
    
        //console.log(id)
    
        const statusProduct = prod?.dataValues.statusProduct;
        if(statusProduct===false){
          const status = await Producto.update(
            {statusProduct:true},
            {where: { id }
          })
          console.log('es false')
          res.send(status);
        }else{
          const status = await Producto.update(
            {statusProduct:false},
            {where: { id:id }
          })
          console.log('es true')
          res.send(status);
        }
       
    
        
      } catch (error) {
        console.log(error);
        return { error: {} }
      }
})




// @route DELETE products/:id
// @desc Elimina un producto por id
// @access Private Admin
productRouter.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    let destroy = await deleteProducto(id);
    if (destroy) return next(destroy.error);

    res.status(204).end();
})

module.exports = productRouter;
