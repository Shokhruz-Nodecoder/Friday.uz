const {Model, DataTypes} = require("sequelize")
const sequelize = require("../database/index")

class Sellers extends Model{}

Sellers.init({
    firstname : {
        type : DataTypes.STRING,
        allowNull : false
    },
    lastname : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false
    },
    phone_number : {
        type : DataTypes.STRING,
        allowNull : false
    },
    company_name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    INN : {
        type : DataTypes.STRING,
        allowNull : false
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
}, {
    sequelize,
    tableName : "sellers",
    createdAt : "created_at",
    updatedAt : "updated_at",
    freezeTableName : true
})

module.exports = Sellers