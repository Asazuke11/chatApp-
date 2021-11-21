'use strict';
const {sequelize, DataTypes} = require('./sequelize-loader');

const User = sequelize.define('users',{
  userId:{
    type:DataTypes.STRING,
    primaryKey: true,
    allowNull:false
  },
  picURL:{
    type:DataTypes.STRING
  },
  username:{
    type:DataTypes.STRING
  }
},{
  freezeTableName:true,
  timestamps:false
});

module.exports = User;