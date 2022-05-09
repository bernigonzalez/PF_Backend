// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize, DataTypes) => {
    // defino el modelo
    const ChatMessage = sequelize.define('ChatMessage', {
        
        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
           },
           sender: {
            type: DataTypes.INTEGER,
            allowNull: false,
           },
           text: {
            type: DataTypes.STRING,
            allowNull: false,
           },
      
        
  
  })};