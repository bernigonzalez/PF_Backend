// Exportamos una funcion que define el modelo
module.exports = (sequelize, DataTypes) => {
  // defino el modelo
  const CarritoDetalle = sequelize.define("CarritoDetalle", {
    cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  }, { timestamps: false });

  CarritoDetalle.associate = (models) => {
    // Relacionando con Producto  (1:1)
    CarritoDetalle.belongsTo(models.Producto, {
      sourceKey: "id",
      foreignKey: "productoId",
    });
    //Relaciondo con Carrito (1:1)
  };
};
