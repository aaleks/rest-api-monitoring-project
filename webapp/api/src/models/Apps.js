/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var Apps = sequelize.define("Apps", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        json: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });
    return Apps;
};
