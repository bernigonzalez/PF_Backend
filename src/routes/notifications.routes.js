require("dotenv").config();
const { Router, res } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); //encriptar contraseña
const { JWT_SECRET } = process.env;
const gravatar = require("gravatar");
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');


const notifRouter = Router();

// requerimos el modelo de Usuario
const { Notifications } = require("../db");
// Requerimos el middleware de autenticación
const { authentication } = require("../middlewares");
const adminAuthentication = require("../middlewares/adminAuthentication");
const { deleteChatNotif, getChatNotifByIdUser, deleteNotif, getNotificationsByIdUser } = require("../controllers/controllerNotif");


//delete Chat notifications (mark as read)

notifRouter.delete('/chat/:idUser', async (req, res, next) => {
    const { idUser } = req.params;

    let destroy = await deleteChatNotif(idUser);
    if (destroy) return next(destroy.error);

    res.status(204).send("chat notifications where successfully deleted");
})


notifRouter.get('/chat/:idUser', async (req, res, next) => {
    const { idUser } = req.params;

    let chatNotif = await getChatNotifByIdUser(idUser);

    res.status(209).send(chatNotif);
})


//delete notifications (mark as read)

notifRouter.delete('/:idUser', async (req, res, next) => {
    const { idUser } = req.params;
    try {
        
             let destroy = await deleteNotif(idUser);
             res.status(204).send("Notifications where successfully deleted");
    }catch(err){
        res.status(500).send("error al eliminar notificaciones")
    }
})

notifRouter.get('/:idUser', async (req, res, next) => {
    const { idUser } = req.params;

    let Notif = await getNotificationsByIdUser(idUser);

    res.status(209).send(Notif);
})



module.exports = notifRouter;