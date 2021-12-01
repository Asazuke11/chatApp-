'use strict';

const USERS_DATA_MAP_A = new Map();

/**
 * 現在追加しているプレイヤーのMapサイズ(人数)を出す関数。
 * @returns {number} マップのサイズを出力
 */
function MapA_Size_Check() {
  return new Promise(resolve => {
    const count_Map = USERS_DATA_MAP_A.size;
    resolve(count_Map);
  })
};

/**
 * USERS_DATA_MAP_Aにユーザ情報を追加する関数。
 * @param {number} id 
 * @param {object} userdata 
 * @returns マップに追加した後のマップサイズ(人数)
 */
function Login_AddMap(socketid, userdata) {
  return new Promise(resolve => {
    USERS_DATA_MAP_A.set(socketid, {
      name: userdata.userName,
      pic: userdata.pic_Num
    }
    );
    resolve(USERS_DATA_MAP_A.size);
  })
}


function deleteMap_Menber(socketId) {
  return new Promise(resolve => {
    USERS_DATA_MAP_A.delete(socketId);
    resolve(USERS_DATA_MAP_A.size);
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
    return ["村人", "人狼", "人狼", "占い師", "怪盗"];
  };
  if (player_Array.length === 4) {
    return ["村人", "村人", "人狼", "人狼", "占い師", "怪盗"];
  }
  if (player_Array.length === 5) {
    return ["村人", "村人", "村人", "人狼", "人狼", "占い師", "怪盗"];
  }
  if (player_Array.length === 6) {
    return ["村人", "村人", "村人", "村人", "人狼", "人狼", "占い師", "怪盗"];
  }
  if (player_Array.length === 7) {
    return ["村人", "村人", "村人", "村人", "村人", "人狼", "人狼", "占い師", "怪盗"];
  }
};



module.exports = {
  Login_AddMap,
  USERS_DATA_MAP_A,
  MapA_Size_Check,
  deleteMap_Menber
};