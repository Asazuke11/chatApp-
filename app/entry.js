'use strict';
import $ from "jquery";
const global = Function('return this;')();
global.jQuery = $;
import bootstrap from 'bootstrap';
import io from 'socket.io-client';
import { isConditional } from "babel-types";
const Config = require('../config');
// const username = $('#main').attr('data-username');

//ニコニコ風コメント機能//
// root -> "/"
const socket = io(`${Config.ipAddress}`);

socket.on('start data', (startObj) => {
  const HexNum = require('crypto').randomBytes(8).toString('hex');
  const marginTop_Array = ["10", "50", "90", "130", "170", "210", "250", "290", "330"];
  const marginTop_random = Math.floor(Math.random() * marginTop_Array.length);
  const marginTop = marginTop_Array[marginTop_random];
  $('.nico-comentArea').append(
    `<div class="move-text" id="C-${HexNum}" style="top:${marginTop}px;">${startObj.coment}</div>`
  );
  $(`#C-${HexNum}`).on('animationend', function () {
    $(`#C-${HexNum}`).remove();
  });
});

//イベント：コネクションがあった
socket.on('connection_count', (count) => {
  $('#connectionCount').text(`${count.count}`);
})
//イベント：コネクションが切れた
socket.on('disconnection_count', (count) => {
  $('#connectionCount').text(`${count.discount}`);
})

//ニコニココメント入力ボタン
$("#Button_send-coment").click(() => {
  if ($("#input-coment").val().length === 0) { return; };
  socket.emit("chat", $("#input-coment").val());
  $("#input-coment").val("");
  return false;
})
//ニコニココメントエンターキー機能
$("#input-coment").keypress((e) => {
  if (e.which === 13) {
    if ($("#input-coment").val().length === 0) { return; };
    socket.emit("chat", $("#input-coment").val());
    $("#input-coment").val("");
    return false;
  }
})

//イベント：ニココメントを受け取った
socket.on("chat", (msg) => {
  const HexNum = require('crypto').randomBytes(8).toString('hex');
  const marginTop_Array = ["10", "50", "90", "130", "170", "210", "250", "290", "330"];
  const marginTop_random = Math.floor(Math.random() * marginTop_Array.length);
  const marginTop = marginTop_Array[marginTop_random];
  $('.nico-comentArea').append(`<div class="move-text" id="C-${HexNum}" style="top:${marginTop}px;">${msg}</div>`);
  $(`#C-${HexNum}`).on('animationend', function () {
    $(`#C-${HexNum}`).remove();
  });
});



//ヘッダーアイコンクリックの挙動//
$('#Name-Setting').click(() => {
  let CSS_status = $(".item-name-input-area").css("display");
  if(CSS_status === "none"){
    $(".item-room-input-area").css("display","none");
    $(".item-name-input-area").css("display","block");
  }else{
  $(".item-name-input-area").css("display","none");
  }
});

$('#Room-make').click(() => {
  let CSS_status = $(".item-room-input-area").css("display");
  if(CSS_status === "none"){
    $(".item-name-input-area").css("display","none");
    $(".item-room-input-area").css("display","block");
  }else{
  $(".item-room-input-area").css("display","none");
  }
});


//  画像ファイル名を入れた配列の作成  //
//  →
//　Characterimage_Array = [s-f001.png,s-f002.png,...s-f370.png]　//

function initChar() {
  let fileLength = 370;
  let chaFile = [];
  for (let i = 1; i <= fileLength; i++) {
    let fileNum = `00${i}`;
    chaFile.push(`s-f${fileNum.slice(-3)}.png`);
  }
  return chaFile;
}
const Characterimage_Array = initChar();

$('.close_heder_toast').click(() => {
  $(".item-name-input-area").css("display","none");
  $(".item-room-input-area").css("display","none");
})

//名前変更ボタンクリック時の挙動//
$('#Button_change_userName').click(() => {
  //ボタンの属性データからクッキーの値を取得
  const cookieID = $('#Button_change_userName').data('user-id');
  const char_Filename = Math.floor(Math.random() * Characterimage_Array.length);

  $('#error-div').text("");
  //クッキーの値が取れなかった時
  if (!cookieID) {
    $('#error-div').text("※ページをリロードしてください。");
    return;
  }

  //インプットエリアの値の取得
  const input_Value = $('#input-name').val();

  //もし文字数が0以下だった場合
  if (input_Value.length <= 0) {
    return;
  } else if (input_Value.length > 10) {　//文字数が11以上
    $('#error-div').text("※ニックネームは１０文字までです。")
    return;
  }

  //Ajax
  /*送るデータ
  * input_Value:インプットから取得した名前のデータ
  * chaURL:画像のファイル名
  * 向こう側でデータベースupsertで更新
  */
  $.post(`/username/${cookieID}`, {
    input_Value: input_Value,
    chaURL: `${Characterimage_Array[char_Filename]}`
  },
    (data) => {
      $('#cha').attr('src', `./images/cha/${data.picURL}`);
      $('.userName').text(`${data.username}`)
    })
})

//部屋変更ボタンクリック時の挙動
$('#Button_makeRoom').click(() => {
  const user_cookie = $("#Button_makeRoom").data("user-id");
  if(!user_cookie){
    $('#error-getCookie').text("※ページをリロードしてください。");
  };
});
