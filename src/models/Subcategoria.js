// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize, DataTypes) => {
    // defino el modelo
    const Subcategoria = sequelize.define('Subcategoria', {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
    }, { timestamps: false });
  
    Subcategoria.associate = models => {
  
      // Relacionando un Categoría con Productos (1:m)
      Subcategoria.belongsTo(models.Categoria, {
        sourceKey: 'id',
        foreignKey: 'categoriaId'
      });
  
    };
  };