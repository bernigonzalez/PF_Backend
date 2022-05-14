require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); //encriptar contraseña
const { JWT_SECRET } = process.env;
const gravatar = require("gravatar");
const { Usuario } = require("../db");
const { Sequelize } = require("sequelize");

const addAdmin = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body

        const contrasena = await bcrypt.hash(password, 10);

        const findUser = await Usuario.findOne({
            where: {
                email: email
            }
        })

        if (!findUser) {
            try {
                const createAdmin = await Usuario.create({
                    email,
                    contrasena,
                    nombre: 'admin',
                    avatar: "//www.gravatar.com/avatar/75d23af433e0cea4c0e45a56dba18b30?s=200&r=pg&d=mm",
                    usuario: 'admin',
                    rol: "2"
                })

                res.send(createAdmin)
            } catch (error) {
                console.log(error)
            }


            const payload = {
                usuario: {
                    id: createAdmin.id,
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
            )
        } else {
            res.send('El usuario ya existe')
        }
    } catch (error) {
        next(error)
    }

}

module.exports = {
    addAdmin
}