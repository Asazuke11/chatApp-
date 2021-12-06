"use strict";
const local_modules = require("./local-modules");
const $ = local_modules.$;
const socket = local_modules.socket;

$("#back-button").on("click", () => {
  window.location = "/index";
});


socket.on("現在のルームA人数",s => {
  if(s < 7){
    $("#roomA-login-now").text(`${s}/7`);
    $("#roomA-login-now").css("color","snow");
    $("#roomA-login-button").text("入室");
  }else if(s >= 7){
    $("#roomA-login-now").text(`満室`);
    $("#roomA-login-now").css("color","red");
    $("#roomA-login-button").text("");
  }
})

$("#roomA-login-button").on("click",() => {
  socket.emit("Aへ入室希望", {});
});

socket.on("入室OK", () => {
  const USER_DATA = local_modules.get_LocalStorageData();
  socket.emit("プレイヤー情報",USER_DATA);
})

socket.on("ルームAへ", map => {
  //map[0][0]:ID
  //map[0][1]:{userName:・・,pic_Num: '・・・.png'}
  //    console.log(key[0]);
  // console.log(key[1].pic_Num);
  $(".ROOM-A").show();
  $(".playerCardArea").empty();
  map.forEach(key => {
    $(".playerCardArea").append(`
    <div class="card">
    <img src="./images/cha/${key[1].pic_Num}" class="char-size">
    <div class="Player-Name">${key[1].userName}</div>
    </div>`)
  })
})