const { Usuario } = require('../db');

module.exports = async (req, res, next) => {
   try {
      let user = await Usuario.findByPk(req.usuario.id);
      user = user.toJSON()

      if (user.rol !== "2") {
         return next({
            status: 403,
            message: 'Acceso denegado'
         }
         );
      }

      next();
   } catch (error) {
      console.log(error);
      next({ status: 500 });
   }
}