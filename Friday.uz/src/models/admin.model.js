const {Model, DataTypes} = require("sequelize")
const sequelize = require("../database/index")

class Admins extends Model{}

Admins.init({
    username : {
        type : DataTypes.STRING,
        allowNull : false
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    }
}, {
    sequelize,
    tableName : "admins",
    createdAt : "created_at",
    updatedAt : "updated_at",
    freezeTableName : true
})

module.exports = Admins