require("dotenv").config();
const { Router, res } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); //encriptar contraseña
const { JWT_SECRET } = process.env;
const gravatar = require("gravatar");
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');

const conversationRouter = Router();

// requerimos el modelo de ChatConversation
const { ChatConversation } = require("../db");
// Requerimos el middleware de autenticación
const { authentication } = require("../middlewares");
const adminAuthentication = require("../middlewares/adminAuthentication");

//create new chat conversation
conversationRouter.post("/", async (req, res) => {
    
    let {memberAdmin, memberBuyer} = req.body
    try{
        let search = await ChatConversation.findAll({
            where: {
                memberBuyer
            }
        })


        if(search.length !== 0) {
            res.status(200).send("Ya existe la conversacion")
        }else {
                
        let newConversation = await ChatConversation.create({
            memberAdmin,
            memberBuyer
        })
        res.status(200).send(newConversation)
        }

    }catch(err){
        res.status(500).json("no se pudo crear la conversacion")
    }
})
//get chat conversation of a user

conversationRouter.get("/:userId", async (req, res) => {
    let userId = parseInt(req.params.userId)
    try{
        const conversation = await ChatConversation.findAll({
            where: {
                [Op.or]: [
                    {
                        memberAdmin: userId
                    },
                     {
                         memberBuyer: userId
                     }
                ]
              }
        })
        res.status(200).send(conversation)
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = conversationRouter;