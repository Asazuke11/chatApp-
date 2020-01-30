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
  User.upsert({
    userId:data.userId,
    picURL:data.picURL,
    username:data.input_Value
  });
};

function lott_Role (player_Array) {
  try{
  let ROLE = ROLE_Array(player_Array);
  for(let i = 0; i < player_Array.length;i++){
    let RandomNumber = Math.floor(Math.random() * ROLE.length);
    player_Array[i][1].Role = ROLE[RandomNumber];
    ROLE.splice(RandomNumber,1);
  }
}
catch (e) {
  console.log(e);
}
};

function ROLE_Array(player_Array) {
    if(player_Array.length === 3){
      return ["村人","人狼","人狼","占い師","怪盗"];
    };
    if(player_Array.length === 4){
      return ["村人","村人","人狼","人狼","占い師","怪盗"];
    }
    if(player_Array.length === 5){
      return ["村人","村人","村人","人狼","人狼","占い師","怪盗"];
    }
    if(player_Array.length === 6){
      return ["村人","村人","村人","村人","人狼","人狼","占い師","怪盗"];
    }
    if(player_Array.length === 7){
      return ["村人","村人","村人","村人","村人","人狼","人狼","占い師","怪盗"];
    }
}



module.exports = {
  User,roomA_count,playerData_update,lott_Role
};