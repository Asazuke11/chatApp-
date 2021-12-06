"use strict";
const local_modules = require("./local-modules");
const $ = local_modules.$;
const io = local_modules.io;
const socket = local_modules.socket;
const trackingIdKey = 'tracking_id';

$(".edit-area").hide();

$("#playRoom-button").on("click", () => {
  const USER_DATA = local_modules.get_LocalStorageData();
  if(!USER_DATA.userName){
    alert("名前を設定してください。");
    $(".edit-area").show();
    return false;
  }
  window.location = "/roby";
})


/**
 * / にアクセスが来たときに動かすプロミス関数。
 * １.ローカルストレージにデータがなければ作成。
 * ２.その後、ローカルストレージのデータ
 * 　 を元にメイン画面の画像を描画。
 */
new Promise((resolve) => {
  local_modules.add_LocalS_Data_init();
  resolve();
}).then(()=> {
  local_modules.updata_view_edit();
  local_modules.updata_view_title();
})


///////////ボタンイベント////////////

//エディットウィンドウの開閉
$('#playerSetting-button').on("click",() => {
  $(".login-area").hide();
  $(".edit-area").fadeToggle();
});
//エディットエリア、キャンセルボタン
$('#name-cansel').on("click",() => {
  $(".edit-area").hide();
});

//「プレイヤー設定」ネーム入力
$("#name-input-area").on("keyup paste", () => {
  $("#name-area-playerName").text($("#name-input-area").val());
});

/**
 * @type {String} キャラクター変更ボタンで変更したイメージurlを
 *                外に受け渡す為のグローバル変数。
 */
let pic_url = "";
//キャラクター変更ボタン
$(".character-select-button").on("click", () => {
  pic_url = local_modules.lottery_Picture();
  $(".edit-area").css({
    'background-image': `url(/images/cha/${pic_url})`
  });
});

//キャラクター設定保存ボタン
$("#name-save").on("click" ,() => {
  let user_data = {};
  const name_Now = $("#name-input-area").val();
  const USER_DATA = local_modules.get_LocalStorageData();

  user_data.userId = USER_DATA.userId;
  user_data.userName = name_Now || USER_DATA.userName ||"ななしくん";
  user_data.pic_Num = pic_url || USER_DATA.pic_Num ||"s-f046.png";

  user_data = JSON.stringify(user_data);
  localStorage.setItem(trackingIdKey,user_data);
  $(".edit-area").hide();
  local_modules.updata_view_edit();
})

$("#LSdelete-button").on("click", () => {
  localStorage.removeItem(trackingIdKey)
  location.reload();
})


//部屋全体の接続者数を更新するイベントの受信
socket.on('現在のログイン数', (size) => {
  $('#login-now').text(size);
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