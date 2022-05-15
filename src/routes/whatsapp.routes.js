const axios = require('axios');
const { Router } = require('express');
const wapRouter = Router();
const { check, validationResult } = require('express-validator');


// Requerimos el middleware de autenticación
const { authentication, adminAuthentication } = require("../middlewares");


wapRouter.get('/', (req, res) => {
  
  res.send(process.env.WHASTAPP)
})

module.exports = wapRouter;