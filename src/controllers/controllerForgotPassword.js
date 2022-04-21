const { Usuario } = require("../db");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { response } = require("express");
require("dotenv").config();
const { JWT_SECRET, EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;

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

    const token = jwt.sign(
      {
        usuario: {
          id: user.id,
        },
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    //user.update({
    //tokenResetPassword: token,
    //});

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${EMAIL_ADDRESS}`,
        pass: `${EMAIL_PASSWORD}`,
      },
    });
    // const emailPort = process.env.EMAIL_PORT || 3000;

    const mailOptions = {
      from: `${EMAIL_ADDRESS}`,
      to: `${user.email}`,
      subject: "Enlace para recuperar su contraseña ",
      text: `https://ecommerce-pg-henry.herokuapp.com/resetpassword/${user.id}/${token} `,
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("Ha ocurrido un error :", err);
      }
      res.status(200).json("El email para la recuperacion ha sido enviado");
    });
  } catch (error) {
    res.status(500).json({
      message: "Ha ocurrido un error",
      error,
    });
  }
};

module.exports = { forgotPassword };
