// Exportamos una funcion que define el modelo
module.exports = (sequelize, DataTypes) => {
    // defino el modelo
    const Favoritos = sequelize.define("Favoritos", {
     
    }, { timestamps: false });
  
    Favoritos.associate = models => {
      // Relacionando con Usuario   (1:1)
      Favoritos.belongsTo(models.Usuario, {
        sourceKey: "id",
        foreignKey: "usuarioId",
      });
      
      Favoritos.belongsTo(models.Producto, {
        sourceKey: "id",
        foreignKey: "productoId",
      });
    };
  };