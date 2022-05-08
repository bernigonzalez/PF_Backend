// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

const {PENDIENTE , ENPROCESO ,ENVIADO, ENTREGADO ,RECHAZADO} = require("../data/constantes");

module.exports = (sequelize, DataTypes) => {
   // defino el modelo
   const Pedido = sequelize.define('Pedido', {
      usuarioId: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      status: {
         type: DataTypes.ENUM(PENDIENTE,ENPROCESO, ENVIADO, ENTREGADO, RECHAZADO),
         allowNull: false,
         defaultValue: PENDIENTE
      },
      pagado: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: false
      },
      total: {
         type: DataTypes.DOUBLE,
         allowNull: false,
      },
      fechaCreacion: {
         type: DataTypes.DATE,
         get() {
            return new Date(this.getDataValue('fechaCreacion'));
         },
         set(fechaCreacion) {
            this.setDataValue('fechaCreacion', fechaCreacion.toISOString().split('T')[0])
         }
      }
   }, {
      timestamps: false
   });


   Pedido.associate = models => {

      // Relacionando Pedido y Lineas de pedido
      Pedido.hasMany(models.LineaDePedido, {
         sourceKey: 'id',
         foreignKey: 'pedidoId'
      });

      // Relacionando Pedido y Usuario
      Pedido.belongsTo(models.Usuario, {
         sourceKey: 'id',
         foreignKey: 'usuarioId'
      });
   }
};