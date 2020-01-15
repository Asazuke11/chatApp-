'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Room = loader.database.define('rooms',{
  roomId:{
    type:Sequelize.UUID,
    primaryKey: true,
    allowNull:false
  },
  roomMemo:{
    type:Sequelize.TEXT
  },
  createdBy:{
    type:Sequelize.STRING
  },
  userName:{
    type:Sequelize.STRING,
    allowNull:false
  }
},{
  freezeTableName:true,
  timestamps:false,
  indexes: [
    {
      fields: ['roomId']
    }
  ]
});

module.exports = Room;