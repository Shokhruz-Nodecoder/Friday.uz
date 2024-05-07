const {Model, DataTypes, Sequelize} = require("sequelize")
const sequelize = require("../database/index")

class Users extends Model{}

Users.init({
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
    fullname : {
        type : DataTypes.STRING,
        allowNull : false
    },
    username : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
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
    tableName : "users",
    createdAt : "created_at",
    updatedAt : "updated_at",
    freezeTableName : true
})

module.exports = Users