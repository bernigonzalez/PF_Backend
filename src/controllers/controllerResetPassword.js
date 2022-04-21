const { Usuario } = require("../db");
const bcrypt = require("bcryptjs");

let regExPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

const ResetPassword = async (req, res, next) => {
  if (!regExPassword.test(req.body.contrasena)) {
    res.status(400).json({
      message:
        "La contraseña deberia contener al menos: 8 caracteres, 1 numero, 1  minuscula, 1 mayuscula y 1 caracter especial",
    });
    return;
  }

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
