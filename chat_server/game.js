'use strict';

/**
 * 現在のログイン数を取得して全体に送る関数
 * @param {Function} Io_Index 
 */
function Login_Size(Io_Index) {
    if(Io_Index.adapter.rooms.has("Everyone's room")){
      const size = Io_Index.adapter.rooms.get("Everyone's room").size;
      Io_Index.emit("現在のログイン数", size);
    }else{
      Io_Index.emit("現在のログイン数", "error");
    };
};

function RoomA_Size(Io_Index,UsersSize) {
  Io_Index.emit("現在のルームA人数", UsersSize);
};


function upDate_Role_map(ROGIN_member_Map_Array,Users) {
  for (let i = 0; i < ROGIN_member_Map_Array.length; i++) {
    Users.set(ROGIN_member_Map_Array[i][0], {
      userId: ROGIN_member_Map_Array[i][1].userId,
      userName: ROGIN_member_Map_Array[i][1].userName,
      pic_Num: ROGIN_member_Map_Array[i][1].pic_Num,
      ready: true,
      Role: ROGIN_member_Map_Array[i][1].Role
    })
  }
}



/**
 * ユーザ情報を入れたマップから切断したプレイヤーを削除
 * @param {uuid} socketId 
 * @returns 削除後のマップサイズ
 */
function deleteMap_Member(socketId,Users) {
  return new Promise(resolve => {
    Users.delete(socketId);
    resolve();
  })
}

function lott_Role(player_Array) {
  try {
    let ROLE = ROLE_Array(player_Array);
    for (let i = 0; i < player_Array.length; i++) {
      let RandomNumber = Math.floor(Math.random() * ROLE.length);
      player_Array[i][1].Role = ROLE[RandomNumber];
      ROLE.splice(RandomNumber, 1);
    }
  }
  catch (e) {
    console.log(e);
  }
};

function ROLE_Array(player_Array) {
  if (player_Array.length === 3) {
    return ["村人","村人", "人狼"];
  };
  if (player_Array.length === 4) {
    return ["村人", "村人", "人狼", "人狼", "占師", "怪盗"];
  }
  if (player_Array.length === 5) {
    return ["村人", "村人", "村人", "人狼", "人狼", "占師", "怪盗"];
  }
  if (player_Array.length === 6) {
    return ["村人", "村人", "村人", "村人", "人狼", "人狼", "占師", "怪盗"];
  }
  if (player_Array.length === 7) {
    return ["村人", "村人", "村人", "村人", "村人", "人狼", "人狼", "占師", "怪盗"];
  }
};


module.exports = {
  Login_Size,
  RoomA_Size,
  deleteMap_Member,
  lott_Role,
  upDate_Role_map
};