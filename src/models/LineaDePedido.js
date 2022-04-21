// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.


module.exports = (sequelize, DataTypes) => {
   // defino el modelo
   const LineaDePedido = sequelize.define('LineaDePedido', {
      pedidoId: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      productoId: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      cantidad: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      total: {
         type: DataTypes.DOUBLE,
         allowNull: false,
      },
   }, {
      timestamps: false
   });

   LineaDePedido.associate = models => {

      // Relacionando LineaDePedido con Pedido 1:m
      LineaDePedido.belongsTo(models.Pedido, {
         sourceKey: 'id',
         foreignKey: 'pedidoId'
      });

      // Relacionando LineaDePedido con Producto 1:m
      LineaDePedido.belongsTo(models.Producto, {
         sourceKey: 'id',
         foreignKey: 'productoId'
      });
   }
};