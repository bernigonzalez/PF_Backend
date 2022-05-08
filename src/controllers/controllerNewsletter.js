const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const { Newsletter } = require('../db')


const postNewsletter = async (nombre, email) => {
  try {
    let exist = await Newsletter.findOne({ where: { email } });

    if (exist) return { error: { status: 400, message: `Ya existe este email en la Newsletter: '${email}'` } };

    let createNewsletter = await Newsletter.create({
      nombre,
      email,
    });

    return createNewsletter;

  } catch (error) {
    console.log(error);
    return { error: {} };
  }
}

module.exports = {
  postNewsletter,
}


