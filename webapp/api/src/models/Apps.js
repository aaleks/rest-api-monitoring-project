/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var Apps = sequelize.define("Apps", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Apps;
};
