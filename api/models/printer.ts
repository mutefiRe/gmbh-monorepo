module.exports = (sequelize, DataTypes) => {
  const Printer = sequelize.define("printer", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    systemName: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: true, unique: false }
  });

  Printer.associate = models => {
    Printer.hasMany(models.Category, { target: "printer" });
  };

  return Printer;
};
