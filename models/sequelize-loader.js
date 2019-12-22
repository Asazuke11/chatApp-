'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/wintern',{
    operatorsAliases:false
  }
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};