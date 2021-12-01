'use strict';
const local_modules = require("./local-modules");
const io = local_modules.io;
const $ = local_modules.$;

//接続者全員が入れる部屋名「　/　」  ///
const socket = io(`/`);



//接続者数を更新するイベントの受信
socket.on('login_now', (e) => {
  $('#login-now').text(e.size);
  $("#roomA-login-now").text(`${e.roomA}/3`);
});

/**
 *　ニコ風コメントを送信
 *  クリックorエンターキーで送信
 */
$("#Button_send-coment").on("click", () => {
  if ($("#input-coment").val().length === 0) { return; };
  socket.emit("nico", $("#input-coment").val());
  $("#input-coment").val("");
})
$("#input-coment").on("keyup paste", (e) => {
  if(e.key === "Enter") {
    if ($("#input-coment").val().length === 0) { return; };
    socket.emit("nico", $("#input-coment").val());
    $("#input-coment").val("");
  };
});

//受信：ニココメント
socket.on("sending nicoComent", (msg) => {
  local_modules.nicoComentModule(msg);
});

