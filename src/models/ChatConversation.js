// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize, DataTypes) => {
    // defino el modelo
    const ChatConversation = sequelize.define('ChatConversation', {
        
        memberAdmin: {
            type: DataTypes.INTEGER,
            allowNull: false,
           },
           memberBuyer: {
            type: DataTypes.INTEGER,
            allowNull: false,
           },
      
        
  
  })};