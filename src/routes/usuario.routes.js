require("dotenv").config();
const { Router, res } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); //encriptar contraseña
const { JWT_SECRET } = process.env;
const gravatar = require("gravatar");
const { check, validationResult } = require('express-validator');

const userRouter = Router();

// requerimos el modelo de Usuario
const { Usuario,Pedido } = require("../db");
// Requerimos el middleware de autenticación
const { authentication } = require("../middlewares");
const adminAuthentication = require("../middlewares/adminAuthentication");

// @route POST user/register
// @desc Registrar Usuarios
// @access Public
userRouter.post("/register", [
  check('nombre', 'Incluya un "nombre" valido').isString().trim().not().isEmpty(),
  check('usuario', 'Incluya un "usuario" valido').isString().trim().not().isEmpty(),
  check('contrasena', 'Incluya una contraseña válida').isString().trim().not().isEmpty(),
  check('email', 'Incluya un email válido').isEmail().exists(),
  
], async (req, res, next) => {
  // Validaciones de express-validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({ status: 400, errors });
  }

  // Si no hay errores, continúo
  const {
    nombre,
    usuario,
    contrasena,
    email,
    pais,
    ciudad,
    provincia,
    direccion,
    telefono,
  } = req.body;

  try {
    let user = await Usuario.findOne({ where: { email } });

    // Si el correo ya está registrado, devuelvo un error
    if (user) {
      return next({ status: 400, message: "Ya posee una cuenta registrada" });
    }

    // Si no, obtenemos la imágen de gravatar para su perfil
    const avatar = gravatar.url(email, {
      s: "200", //size
      r: "pg", //rate
      d: "mm",
    });

    // Creamos el usuario
    user = {
      nombre,
      usuario,
      contrasena,
      email,
      ciudad,
      pais,
      provincia,
      direccion,
      telefono,
      avatar,
      rol: 1,
    };

    // Encriptamos la contraseña (complejidad 10)
    user.contrasena = await bcrypt.hash(contrasena, 10);

    // Creamos el nuevo usuario y lo guardamos en la DB
    try {
      user = await Usuario.create(user);
      
    } catch (error) {
      // no se ha podido crear el usuario
      console.log(error);
    }

    // generamos el payload/body para generar el token
    const payload = {
      usuario: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn: 360000, //for development
      },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.log(err);
    next({});
  }
});

// @route POST user/login
// @desc Logear un usuario
// @access Public
userRouter.post("/login", [
  check('email', 'Incluya un email válido').isEmail().exists(),
  check('contrasena', 'Incluya una contraseña válida').isString().exists()
  
], async (req, res, next) => {
  // Validaciones de express-validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({ status: 400, errors });
  }

  // Si no hay errores, continúo
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return next({
      status: 400,
      message: "No se han proporcionado credenciales de acceso",
    });
  }

  try {
    let user = await Usuario.findOne({ where: { email } });

    // significa que el correo no es válido
    if (!user) return next({ status: 400, message: "Credenciales no validas" });

    user = user.toJSON();
    if (user.rol === "3") return next({ status: 403, message: "Usuario bloqueado" });

    // Teniedo el usuario, determinamos si la contraseña enviada es correcta
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    // si la contraseña es incorreta
    if (!isMatch)
      return next({ status: 400, message: "Credenciales no validas" });

    // si la contraseña y email son validos escribimos el payload/body
    const payload = {
      usuario: { id: user.id },
    };

    // GENERO UN TOKEN
    jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
  } catch (err) {
    console.log(err);
    next({ status: 500 });
  }
});

// @route GET api/user
// @desc Información del usuario
// @access Private
userRouter.get("/", authentication, async (req, res, next) => {

  try {
    let user = await Usuario.findByPk(req.usuario.id);

    user && (user = user.toJSON());

    // le borramos la contraseña
    delete user.contrasena;

    res.json(user);
  } catch (err) {
    console.log(err);
    next({ status: 500 });
  }
});


// @route GET api/user/all
// @desc Me trae todos los usuarios
// @access Private admin
userRouter.get("/all",  async (req, res, next) => {
  try {
    const users = await Usuario.findAll({ attributes: { exclude: ['contrasena'] } });

    res.json(users);
  } catch (error) {
    console.log(error);
    next({});
  }
});


// @route PUT user/update/
// @desc Actualizar los datos de un usuario
// @access Private
userRouter.put("/update", /*[
  check('id', 'Incluya un "id" valido').isInt({ min: 1 }),
  check('nombre', 'Incluya un "nombre" valido').isString().trim().not().isEmpty(),
  check('usuario', 'Incluya un "usuario" valido').isString().trim().not().isEmpty(),
  check('contrasena', 'Incluya una contraseña válida').isString().trim().not().isEmpty(),
  check('email', 'Incluya un email válido').isEmail().exists(),
  check('pais', 'Incluya un país válido').isString().trim().not().isEmpty(),
  check('provincia', 'Incluya una provincia válida').isString().trim().not().isEmpty(),
  check('direccion', 'Incluya una direccion válida').isString().trim().not().isEmpty(),
  check('telefono', 'Incluya un telefono válido').isString().isLength({ min: 8 }),
], authentication,*/ async (req, res, next) => {
  // Validaciones de express-validator
  /*const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({ status: 400, errors });
  }*/

  // Si no hay errores, continúo
  const {
    id,
    nombre,
    avatar,
    usuario,
    contrasena,
    email,
    ciudad,
    pais,
    provincia,
    direccion,
    telefono,
  } = req.body;

  if (!id) return next({ status: 400, message: "El id es Requerido" });
  /*let avata = gravatar.url(email, {
    s: "200", //size
    r: "pg", //rate
    d: "mm",
  });*/
  try {
    /*let password = await bcrypt.hash(contrasena, 10);*/
    const UserUpdate = await Usuario.update(
      {
        nombre,
        avatar,
        usuario,
        contrasena,
        email,
        ciudad,
        pais,
        provincia,
        direccion,
        telefono,
      },
      {
        where: {
          id,
        },
      }
    );
    if (UserUpdate)
      return res
        .status(200)
        .json({ message: "Los Datos fueron Actualizados" });

    return res.status(203).json({ message: "Algo Sucedio" });
  } catch (error) {
    return next({});
  }
});
////////////UPDATE IMG
userRouter.put("/updateImg",/*  [
  check('id', 'Incluya un "id" valido').isInt({ min: 1 }),
  check('nombre', 'Incluya un "nombre" valido').isString().trim().not().isEmpty(),
  check('usuario', 'Incluya un "usuario" valido').isString().trim().not().isEmpty(),
  check('contrasena', 'Incluya una contraseña válida').isString().trim().not().isEmpty(),
  check('email', 'Incluya un email válido').isEmail().exists(),
  check('pais', 'Incluya un país válido').isString().trim().not().isEmpty(),
  check('provincia', 'Incluya una provincia válida').isString().trim().not().isEmpty(),
  check('direccion', 'Incluya una direccion válida').isString().trim().not().isEmpty(),
  check('telefono', 'Incluya un telefono válido').isString().isLength({ min: 8 }),
], authentication, */ async (req, res, next) => {
  // Validaciones de express-validator
 /*  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({ status: 400, errors });
  } */

  // Si no hay errores, continúo
  const {
    id,
    img,
  } = req.body;

  if (!id) return next({ status: 400, message: "El id es Requerido" });
/*   let avata = gravatar.url(email, {
    s: "200", //size
    r: "pg", //rate
    d: "mm",
  }); */
  try {
/*     let password = await bcrypt.hash(contrasena, 10); */
    const UserUpdate = await Usuario.update(
      {
        avatar: img,

      },
      {
        where: {
          id: id,
        },
      }
    );
    if (UserUpdate)
      return res
        .status(200)
        .json({ message: "Los Datos fueron Actualizados" });

    return res.status(203).json({ message: "Algo Sucedio" });
  } catch (error) {
    return next({});
  }
});

//////////////////

// @route PUT user/block/:userId
// @desc Bloquear un usuario
// @access Private admin
userRouter.put("/block/:userId",   async (req, res, next) => {
  try {
    const pedidoEncontrado = await Pedido.findOne({where: {
      usuarioId: req.params.userId
    }
  })
   
  const estPedido = pedidoEncontrado?.dataValues.status;
  
  if(estPedido){
    if(estPedido==='COMPLETADO'||estPedido==='RECHAZADO'){
      await Usuario.update({ rol: "3" }, { where: { id: req.params.userId } });
      res.send('Usuario bloqueado')
    }else{
      res.send(`El usuario tiene un pedido en espera no ha podido ser bloqueado`)
    }
  }else{
    await Usuario.update({ rol: "3" }, { where: { id: req.params.userId } });
    res.send('Usuario bloqueado')
  }
  } catch (error) {
    console.log(error);
    return next({ status: 500, message: "No se ha podido bloquear al usuario" });
  }
});


// @route PUT user/unlock/:userId
// @desc Desbloquear un usuario
// @access Private admin
userRouter.put("/unlock/:userId", async (req, res, next) => {
  try {
    await Usuario.update({ rol: "1" }, { where: { id: req.params.userId } });

    res.end();
  } catch (error) {
    cosole.log(error);
    return next({ status: 500, message: "No se ha podido desbloquear al usuario" });
  }
});

userRouter.get("/getUserById/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const userById = await Usuario.findByPk(id
      // include: [{
      //   model: Pedido,
      //   attributes: [],
      //   through: {
      //     attributes: [],
      //   }
      // }]
    )
    res.send(userById)
  } catch (error) {
    console.log(error)
  }
})
//////////////////

userRouter.post("/updateOrder",async (req, res, next) => {

  const {
    id,
    username,
    address,
    phone,
    contactName,
    city
  } = req.body;

  if (!id) return next({ status: 400, message: "El id es Requerido" });

  try {
    console.log(req.body)
    const UserUpdate = await Usuario.update(
      {
        usuario: username,
        nombre:contactName,
        telefono:phone,
        direccion: address,
        ciudad: city,

      },
      {
        where: {
          id: id,
        },
      }
    );
    console.log(UserUpdate)
   
   return res.status(200).json({ message: "Los Datos fueron Actualizados" });

   
  } catch (error) {
    return res.status(404).json({ message: "Algo Sucedio" });
  }
});

module.exports = userRouter;
