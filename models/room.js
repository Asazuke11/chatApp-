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
  inRoomNow:{
    type:Sequelize.INTEGER
  },
  createdBy:{
    type:Sequelize.STRING
  }
},{
  freezeTableName:true,
  timestamps:false
});

module.exports = Room;