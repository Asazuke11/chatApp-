'use strict';
var User = require('../models/user');

//現在の入室プレイヤー人数を取得する関数
function roomA_count(Io_Index) {
  if (Io_Index.adapter.nsp.adapter.rooms["room-A"]) {
    return Io_Index.adapter.rooms["room-A"].length;
  } else {
    return 0;
  };
};

//データベースのプレイヤー情報を更新
function playerData_update(data){
  console.log(data);
  User.upsert({
    userId:data.userId,
    picURL:data.picURL,
    username:data.input_Value
  });
};

module.exports = {
  User,roomA_count,playerData_update
};