const { ACTIVA, INACTIVA } = require("../data/constantes");

module.exports = (sequelize, DataTypes) => {
  // defino el modelo
  const Oferta = sequelize.define('Ofertas', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    porcentajeDescuento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
        max: 100
      },
    },
    estado: {
      type: DataTypes.ENUM(ACTIVA, INACTIVA),
      allowNull: false,
      defaultValue: ACTIVA
    },
  }, {
    timestamps: false
  });

  Oferta.associate = models => {

    // Relacionando Oferta y OfertaProducto
    Oferta.hasMany(models.OfertaProducto, {
      sourceKey: 'id',
      foreignKey: 'ofertaId'
    });
  }
};