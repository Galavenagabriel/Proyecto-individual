const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Genre = sequelize.define('Genre', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Genre;
}