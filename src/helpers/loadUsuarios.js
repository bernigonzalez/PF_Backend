const { Usuario } = require('../db')
const DATA_USERS = require("../data/usuarios.db");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");


const loadUsuarios = async () => {
   try {
      const usuariosMaped = await Promise.all(DATA_USERS.map(async (e) => {
         let contrasena = "", avatar = "";
         contrasena = await bcrypt.hash(e.contrasena, 10);
         avatar = gravatar.url("admin@gmail.com", {
            s: "200", //size
            r: "pg", //rate
            d: "mm",
         });

         return {
            nombre: e.nombre,
            usuario: e.usuario,
            contrasena,
            email: e.email,
            pais: e.pais,
            provincia: e.provincia,
            direccion: e.direccion,
            ciudad: e.ciudad,
            telefono: e.telefono,
            rol: e.rol,
            avatar
         };
      }));

      await Promise.all(usuariosMaped.map(async (e) => {
         const user = await Usuario.findOne({ where: { email: e.email } });
         !user && await Usuario.create({
            ...e
         })
      }))

      console.log("Usuarios cargados exitosamente");
   } catch (error) {
      console.log(error);
      console.log("No ha sido posible cargar los usuarios en la DB");
   }
}


module.exports = loadUsuarios;