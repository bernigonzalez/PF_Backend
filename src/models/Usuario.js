// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize, DataTypes) => {
  // defino el modelo
  const Usuario = sequelize.define('Usuario', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contrasena: {
      type: DataTypes.STRING,
     
    },
    email: {
      type: DataTypes.STRING,

    },
    pais: {
      type: DataTypes.STRING,

    },
    provincia: {
      type: DataTypes.STRING,

    },
    direccion: {
      type: DataTypes.STRING,

    },
    telefono: {
      type: DataTypes.STRING,

    },
    ciudad: {
      type: DataTypes.STRING,

    },
    rol: {
      // 1 -> normal; 2 -> admin
      type: DataTypes.ENUM("1", "2", "3"),
      allowNull: false,
      defaultValue: "1"
    },


  }, {
    timestamps: false
  });

  Usuario.associate = models => {

    // Relacionando un Producto con Categoría (1:m)
    Usuario.hasMany(models.Pedido, {
      sourceKey: 'id',
      foreignKey: 'usuarioId'
    });

  };
};
