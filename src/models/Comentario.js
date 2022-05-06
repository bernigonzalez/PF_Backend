
module.exports = (sequelize, DataTypes) => {
  // defino el modelo
  const Comentario = sequelize.define('Comentario', {
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },


  }, { timestamps: true });

  Comentario.associate = models => {
    // Relacionando un Comentario con un usuario(1:1)
    Comentario.belongsTo(models.Usuario, {
      sourceKey: 'id',
      foreignKey: 'usuarioId'
    });

    // Relacionando un Comentario con un Producto(1:1)
    Comentario.belongsTo(models.Producto, {
      sourceKey: 'id',
      foreignKey: 'productoId'
    });
  };
};