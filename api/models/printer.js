module.exports = function (sequelize, DataTypes) {
  const Printer = sequelize.define("printer", {
    id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    systemName: { type: DataTypes.STRING, allowNull: false, unique: true },
    name:       { type: DataTypes.STRING, allowNull: true, unique: false }
  }, {
    classMethods: {
      associate(models) {
        Printer.hasMany(models.User,      {target: "printer"});
        Printer.hasMany(models.Category,  {target: "printer"});
        Printer.hasMany(models.Setting,   {target: "printer"});
      }
    }
  })
  return Printer;
}
