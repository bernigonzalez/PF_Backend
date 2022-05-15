require("dotenv").config();
const { Router, res } = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { Usuario } = require("../db");
const googleRouter = Router();

googleRouter.post("/", async (req, res, next) => {
   
    const {
      nombre,
      usuario,
      email,
     avatar
    } = req.body;
  
    try {
    // Creamos el nuevo usuario y lo guardamos en la DB
    let user = await Usuario.findOne({ where: { email } });
    if(user){
     await Usuario.update({
        nombre,
        usuario,
        email,
        avatar
     }, {
        where: { email}
     })

     const payloadUser = {
      usuario: {
        id: user.id,
      },
    };

     jwt.sign(
      payloadUser,
      JWT_SECRET,
      {
        expiresIn: 360000, //for development
      },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
    }else{
    user = {
      nombre,
      usuario,
      avatar,
      email,
    }
      user = await Usuario.create(user)
         console.log(user);
     
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
      }
    } catch (err) {
      console.log(err);
      next({});
    }
  });
  

module.exports = googleRouter