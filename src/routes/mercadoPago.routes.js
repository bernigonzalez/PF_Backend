const bodyPago  = require('../helpers/bodyPago');

const axios = require('axios');
const { Router } = require('express');
const pagoRouter = Router();
const { check, validationResult } = require('express-validator');


// Requerimos el middleware de autenticación
const { authentication, adminAuthentication } = require("../middlewares");

const urlMercadoPago = "https://api.mercadopago.com/checkout/preferences";


// pagoRouter.get('/', (req, res) => {
//   let {price} = req.body
//   bodyPago.items[0].unit_price = price
//   res.json(bodyPago)
// })

// @route POST PAGO/
// @desc Crear un nuevo link de pago
// @access Private 
pagoRouter.post('/', [
    check('price', 'El campo "price" es requerido y debe ser un número').not().isEmpty().isNumeric({ min: 1 }),
],  async (req, res, next) => {
    // Validaciones de express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next({ status: 400, errors });
    }

    console.log("bodyPago", bodyPago)
    // Si no hay errores, continúo
    const { price } = req.body
    bodyPago.items[0].unit_price = price
    
    const respuesta = await axios.post(urlMercadoPago, bodyPago, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ` + process.env.API_MP
        }
     })

    res.status(200).json(respuesta.data["init_point"]);
 }
)

module.exports = pagoRouter;