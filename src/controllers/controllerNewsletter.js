const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const { Newsletter } = require('../db')
const nodemailer = require("nodemailer");
const { EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;


const postNewsletter = async (nombre, email) => {
  try {
    let exist = await Newsletter.findOne({ where: { email } });

    if (!exist) {
      let createNewsletter = await Newsletter.create({
        nombre,
        email,
      });
      altaNewsletter(nombre, email)
      return createNewsletter;
    } else if (exist) return { error: { status: 400, message: `Ya existe este email en la Newsletter: '${email}'` } };
  } catch (error) {
    console.log(error);
    return { error: {} };
  }
}


const altaNewsletter = (nombre, email) => {
  console.log(nombre, email)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${EMAIL_ADDRESS}`,
      pass: `${EMAIL_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: `"MOBI Alta-Newsletter"  <${EMAIL_ADDRESS}>`,// sender address
    to: `${email}`,// list of receivers
    subject: "¡Bienvenido a nuestro Newsletter!", // Subject line
    text: `¡Hola ${nombre}! Te damos la bienvenida a nuestro Newsletter. Aquí recibiras las mejores promociones para acondicionar tu hogar.`, // html body
  };

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.error("Ha ocurrido un error :", err);
    }
  })
}


module.exports = {
  postNewsletter,
}


