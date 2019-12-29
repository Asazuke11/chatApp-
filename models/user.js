'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const User = loader.database.define('users',{
  userId:{
    type:Sequelize.STRING,
    primaryKey: true,
    allowNull:false
  },
  picURL:{
    type:Sequelize.STRING
  },
  username:{
    type:Sequelize.STRING
  },
  expires:{
    type:Sequelize.STRING
  }
},{
  freezeTableName:true,
  timestamps:false
});

module.exports = User;