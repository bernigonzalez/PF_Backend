// Exportamos una funcion que define el modelo
module.exports = (sequelize, DataTypes) => {
  // defino el modelo
  const Carrito = sequelize.define("Carrito", {
    //cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  }, { timestamps: false });

  Carrito.associate = (models) => {
    // Relacionando con Usuario   (1:1)
    Carrito.belongsTo(models.Usuario, {
      sourceKey: "id",
      foreignKey: "usuarioId",
    });
    // Relacionando con CarritoDetalle (productos)  (1:m)
    Carrito.hasMany(models.CarritoDetalle, {
      sourceKey: "id",
      foreignKey: "carritoId",
    });
  };
};
