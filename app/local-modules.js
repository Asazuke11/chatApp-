"use strict";

const $ = require('jquery');
const io = require("socket.io-client");


/**
 * ローカルストレージのキー名
 * @type {String}
 */
 const trackingIdKey = 'tracking_id';

/** 
 * キャラクタイメージの数を入れた変数。(現在320枚)
 * @type {Number}
*/
const pictureSize = 320;


/**
 * キャラクターイメージ変更ボタンが押された時に値を入れる変数
 * @type {String}
 */
 let pic_url = "";

 /**
 * ローカルストレージからデータを呼び出す関数。
 * (JSONパース済み)
 * @return {object}
 */
function get_LocalStorageData(){
  let userdata = localStorage.getItem(trackingIdKey);
  userdata = JSON.parse(userdata);
  return userdata;
}


/**
 * ローカルストレージにデータが無いときに使用する関数。
 */
 function add_LocalS_Data_init(){
  const USER_DATA = get_LocalStorageData();
  if(!USER_DATA){
    let user_data = {};
    user_data.userName = "";
    user_data.pic_Num = "s-f046.png";
    user_data = JSON.stringify(user_data);
    localStorage.setItem(trackingIdKey,user_data);
  }
}

/**
 * ローカルストレージデータと同期した画像と名前で
 * エディット画面を更新する関数。
 */
 function updata_view_edit(){
  const USER_DATA = get_LocalStorageData();

  if(USER_DATA){
    $("#name-area-playerName").text(USER_DATA.userName);
    $(".edit-area").css({
      "background-image":`url(../images/cha/${USER_DATA.pic_Num})`
    });
  }
};


/**
 * ローカルストレージデータに
 * 同期したイメージをタイトル画面に描画する関数。
 */
 function updata_view_title(){
  const USER_DATA = get_LocalStorageData();
  if(USER_DATA){
    $("#name-display-title-area").text(USER_DATA.userName);
    $("#backGround-jinroukun").attr("src",`../images/cha/${USER_DATA.pic_Num}`);
  }
};


/**
 * イメージファイル名を配列に入れ出力する関数
 * ["s-f001.png","s-f002.png",・・・]
 * @return {Array}
 */
function making_CharFileName_Array() {
  let chaFileArray = [];
  for (let i = 1; i <= pictureSize; i++) {
    let fileNum = `00${i}`;
    chaFileArray.push(`s-f${fileNum.slice(-3)}.png`);
  };
  return chaFileArray;
}

/**
 * @type {Array} イメージファイル名を入れた配列。
 */
const characterPicture_Array = making_CharFileName_Array();

/**
 * ランダムでキャラクターを変更する関数
 * @returns {String} ランダムで選ばれたイラスト番号
 */
function lottery_Picture(){
  const random_number = Math.floor(Math.random() * pictureSize);
  const pic_url = characterPicture_Array[random_number];
  return pic_url;
}

/**
 * サーバからコメントを受け取った時に、全接続者へ
 * コメントを表示し、アニメーションが終了したら、
 * 要素を削除する関数。
 * @param {String} msg 
 */
function nicoComentModule(msg) {
  const HexNum = Math.floor(Math.random() * 10000);
  const marginTop_Array = ["10", "50", "90", "130", "170", "210", "250", "290", "330"];
  const marginTop_random = Math.floor(Math.random() * marginTop_Array.length);
  const marginTop = marginTop_Array[marginTop_random];
  $('.Wrapper-niconicoArea').append(`<div class="move-text" id="C-${HexNum}" style="top:${marginTop}px;">${msg}</div>`);
  $(`#C-${HexNum}`).on('animationend', () => {
    $(`#C-${HexNum}`).remove();
  });
}


module.exports = {
  $,
  io,
  add_LocalS_Data_init,
  making_CharFileName_Array,
  get_LocalStorageData,
  updata_view_edit,
  updata_view_title,
  lottery_Picture,
  nicoComentModule
}