const { Usuario } = require("../db");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { response } = require("express");
require("dotenv").config();
const { CORS_URL } = process.env;

const forgotPassword = async (req, res, next) => {
  if (req.body.email == "") {
    res.status(400).send({
      message: "El mail es requerido",
    });
  }
  try {
    const user = await Usuario.findOne({
      where: {
        email: req.body.email,
      },
    });

  
    //user.update({
    //tokenResetPassword: token,
    //});
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `tumobi44@gmail.com`,
        pass: `nahfpzwtlinfvnwp`,
      },
    });
    // const emailPort = process.env.EMAIL_PORT || 3000;
     
    const mailOptions = {
      from: `Mobi <tumobi44@gmail.com>`,
      to: `${user.email}`,
      subject: "Enlace para recuperar su contraseña ",
      text: `Ingrese al siguiente link para recuperar la contraseña  ${CORS_URL}/resetpassword/${user.id}`
    };
     
    

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("Ha ocurrido un error :", err);
        return  res.status(400).json({
          message: "Ha ocurrido un error en el envio del email",
          err,
        });
      }
      console.log(response)
      res.status(200).json({message:"El email para la recuperacion ha sido enviado"});
    });
  
  } catch (error) {
    res.status(404).json({
      message: "No estás registrado con este email",
      error,
    });
  }
};

module.exports = { forgotPassword };
