/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var Checks = sequelize.define("Checks", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                Checks.belongsTo(models.Apps, {foreignKey: 'checked_app', allowNull: false});
            }
        }
    });
    return Checks;
};
