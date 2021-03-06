/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var Apps = sequelize.define("Apps", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                Apps.hasMany(models.Checks, {foreignKey: 'checked_app'});
            }
        }
    });

    return Apps;
};
