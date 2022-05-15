// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize, DataTypes) => {
    // defino el modelo
    const Notifications = sequelize.define('Notifications', {
        
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
           },
           type: {
            type: DataTypes.INTEGER,
            allowNull: false,
           },
           status: {
            type: DataTypes.STRING,
            allowNull: false,
           },
           sender: {
            type: DataTypes.INTEGER,
            allowNull: true,
           },
           senderName: {
            type: DataTypes.STRING,
            allowNull: true,
           },
           text: {
            type: DataTypes.STRING,
            allowNull: true,
           },
           conversationId: {
            type: DataTypes.INTEGER,
            allowNull: true,
           },
      
        
  
  }, { timestamps: false })};