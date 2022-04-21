
module.exports = (sequelize, DataTypes) => {
   // defino el modelo
   const OfertaProducto = sequelize.define('OfertaProducto', {
      productoId: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      ofertaId: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      cantidad: {
         type: DataTypes.INTEGER,
         allowNull: false,
         defaultValue: 5
      },
   }, {
      timestamps: false
   });

   OfertaProducto.associate = models => {

      // Relacionando OfertaProducto con Oferta 1:m
      OfertaProducto.belongsTo(models.Pedido, {
         sourceKey: 'id',
         foreignKey: 'ofertaId'
      });

      // Relacionando OfertaProducto con Producto 1:m
      OfertaProducto.belongsTo(models.Producto, {
         sourceKey: 'id',
         foreignKey: 'productoId'
      });
   }
};