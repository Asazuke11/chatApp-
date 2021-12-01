"use strict";
const local_modules = require("./local-modules");
const $ = local_modules.$;
const trackingIdKey = 'tracking_id';

$(".edit-area").hide();

$("#playRoom-button").on("click", () => {
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
  user_data.userName = name_Now || USER_DATA.userName ||"ななしくん";
  user_data.pic_Num = pic_url || USER_DATA.pic_Num ||"s-f046.png";
  user_data = JSON.stringify(user_data);
  localStorage.setItem(trackingIdKey,user_data);
  $(".edit-area").hide();
  local_modules.updata_view_edit();
  local_modules.updata_view_title();
})
