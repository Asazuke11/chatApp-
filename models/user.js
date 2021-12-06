'use strict';
const {sequelize, DataTypes} = require('./sequelize-loader');

const User = sequelize.define('users',{
  userId:{
    type:DataTypes.UUID,
    primaryKey: true,
    allowNull:false
  }
},{
  freezeTableName:true,
  timestamps:false
});

module.exports = User;