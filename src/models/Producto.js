// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize, DataTypes) => {
  // defino el modelo
  const Producto = sequelize.define('Producto', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.FLOAT,

    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
     },
    // category: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
     },
     size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // rate: {
    //   type: DataTypes.FLOAT,
    //   defaultValue: 0
    // },
    // count: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0
    // },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    statusProduct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true 
    }

  }, {
    timestamps: true
  });

  Producto.associate = models => {

    // Relacionando un Producto con Categoría (1:m)
    Producto.belongsTo(models.Categoria, {
      sourceKey: 'id',
      foreignKey: 'categoriaId'
    });

  };
};
