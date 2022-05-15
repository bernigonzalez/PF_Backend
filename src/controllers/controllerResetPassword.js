const { Usuario } = require("../db");
const bcrypt = require("bcryptjs");



const ResetPassword = async (req, res, next) => {
  

  try {
    const contrasena = await bcrypt.hash(req.body.contrasena, 10);
    const resetPassword = await Usuario.update(
      { contrasena },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(201).json({
      message: "contraseña cambiada con exito",
      data: resetPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: "este error",
      error,
    });
  }
};

module.exports = { ResetPassword };
