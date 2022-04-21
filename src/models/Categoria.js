// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize, DataTypes) => {
  // defino el modelo
  const Categoria = sequelize.define('Categoria', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  }, { timestamps: false });

  Categoria.associate = models => {

    // Relacionando un Categoría con Productos (1:m)
    Categoria.hasMany(models.Producto, {
      sourceKey: 'id',
      foreignKey: 'categoriaId'
    });

  };
};