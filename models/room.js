'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Room = loader.database.define('rooms',{
  roomId:{
    type:Sequelize.UUID,
    primaryKey: true,
    allowNull:false
  },
  roomName:{
    type:Sequelize.STRING
  },
  roomMemo:{
    type:Sequelize.STRING
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  createdBy:{
    type:Sequelize.STRING
  }
},{
  freezeTableName:true,
  timestamps:false
});

module.exports = Room;