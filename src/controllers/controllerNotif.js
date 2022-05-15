const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const { Notifications, Usuario } = require('../db')


const postChatNotif = async (data) => {
    let {message, receiverId} = data
    try {
    //   let exist = await Notifications.findOne({ where: { title } });
  
    //   if (exist) return { error: { status: 400, message: `Ya existe un producto con ese nombre: '${title}'` } };
    //   console.log("esta es la data que recibe el controllerNotif", message, receiverId)  
      let createdNotif = await Notifications.create({
        userId: receiverId,
        type: 1,
        status: "pendiente",
        sender : message.sender,
        senderName : message.senderName,
        text : "",
        conversationId : message.conversationId,
      });
  
      return createdNotif;
  
    } catch (error) {
      console.log(error);
      return { error: {} };
    }
  }

  const getChatNotifByIdUser = async (idUser) => {
    try {
      let foundedChatNotif = await Notifications.findAll( {
        where: {
            [Op.and]: [
              {
                userId : idUser
              },
              {
                type : 1
              }
            ]
          }
      });
  
      if (!foundedChatNotif) return { error: { status: 404, message: "Chat Notif no encontrado para este usuario" } };
  
      return foundedChatNotif;
    } catch (e) {
      console.log(e);
      return { error: {} };
    }
  }

  const deleteChatNotif = async (idUser) => {
    try {
      
      // console.log(id)
      dest = await Notifications.destroy({
        where: {
            [Op.and]: [
              {
                userId : idUser
              },
              {
                type : 1
              }
            ]
          }
      })
  
      return ;
    } catch (error) {
      console.log(error);
      return { error: {} }
    }
  }


  const postNotif = async (data) => {
    try {
    //   let exist = await Notifications.findOne({ where: { title } });
  
    //   if (exist) return { error: { status: 400, message: `Ya existe un producto con ese nombre: '${title}'` } };
        
      
      console.log("llege a controller notif con la data", data)  
      let createdNotif = await Notifications.create(data);
  
      console.log("createdNotif", createdNotif)
      return createdNotif;
      
  
    } catch (error) {
      console.log(error);
      return { error: {} };
    }
  }

  const deleteNotif = async (idUser) => {
    try {
      
      // console.log(id)
      dest = await Notifications.destroy({
        where: {
            [Op.and]: [
              {
                userId : idUser
              },
              {
                type : {
                    [Op.in]: [2, 3, 4, 5, 6, 7, 8]
                }
              }
            ]
          }
      })
  
      return ;
    } catch (error) {
      console.log(error);
      return { error: {} }
    }
  }

  const getNotificationsByIdUser = async (idUser) => {
    try {
      let foundedNotif = await Notifications.findAll( {
        where: {
            [Op.and]: [
              {
                userId : idUser
              },
              {
                type : {
                    [Op.in]: [2, 3, 4, 5, 6, 7, 8]
                }
              }
            ]
          }
      });
  
      if (!foundedNotif) return { error: { status: 404, message: "Notificaciones no encontradas para este usuario" } };
  
      return foundedNotif;
    } catch (e) {
      console.log(e);
      return { error: {} };
    }
  }

  const findAdminId = async() => {
      try {
        
               let admin =   await Usuario.findOne({
                    where: {
                      [Op.and]: [
                        {
                          nombre: "Admin"
                        },
                        {
                          rol: "2"
                        }
                      ]
                    },
                    raw: true,
                  });

                return (admin)
      }catch(err){    
        console.log(error);
        return { error: {} };
      }

  }


  
  module.exports = {
    postChatNotif,
    deleteChatNotif,
    getChatNotifByIdUser,
    postNotif,
    deleteNotif,
    getNotificationsByIdUser,
    findAdminId,
  }