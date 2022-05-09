require("dotenv").config();
const { Router, res } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); //encriptar contraseña
const { JWT_SECRET } = process.env;
const gravatar = require("gravatar");
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');


const messageRouter = Router();

// requerimos el modelo de Usuario
const { ChatMessage } = require("../db");
// Requerimos el middleware de autenticación
const { authentication } = require("../middlewares");
const adminAuthentication = require("../middlewares/adminAuthentication");


//add message
messageRouter.post("/", async(req, res) => {
      
    let {conversationId, sender, text} = req.body
    try{
        let newMessage = await ChatMessage.create({
            conversationId,
            sender,
            text
        })
        res.status(200).send(newMessage)

    }catch(err){
        res.status(500).json(err)
    }
})


//get messages from a conversation
messageRouter.get("/:conversationId", async(req, res) => {
    try{
        const messages = await ChatMessage.findAll({
            where : {
                conversationId: req.params.conversationId
            }
        })
        res.status(200).json(messages)
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = messageRouter;