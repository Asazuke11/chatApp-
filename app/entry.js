'use strict';
import $ from "jquery";
const global = Function('return this;')();
global.jQuery = $;
import bootstrap from 'bootstrap';
import io from 'socket.io-client';
import { isConditional } from "babel-types";
const Config = require('../config');


//ニコニコ風コメント機能//
// namespace -> "/index"

//接続開始
const socket = io(`/index`);

socket.on('start data', (startObj) => {
  $('.item-Connection-Count').addClass('animated jello faster');
  setTimeout(RemoveClass,1000);
  function RemoveClass(){
    $('.item-Connection-Count').removeClass('animated jello faster');
  }
});

//イベント：コネクションがあった
socket.on('connection_count', (count) => {
  $('#connectionCount').text(`${count.count}`);
  $('#login_now').text(`${count.roomAcount}/7`);
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
$('.item-Icon-Setting').click(() => {
  let CSS_status = $(".item-name-input-area").css("display");
  if(CSS_status === "none"){
    $(".item-name-input-area").css("display","block");
  }else{
  $(".item-name-input-area").css("display","none");
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

//☓ボタンを押したときにクローズ
$('.close_heder_toast').click(() => {
  $(".item-name-input-area").css("display","none");
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
  $.post(`/index/username/${cookieID}`, {
    input_Value: input_Value,
    chaURL: `${Characterimage_Array[char_Filename]}`
  },
    (data) => {
      $('#cha').attr('src', `./images/cha/${data.picURL}`);
      $('.userName').text(`${data.username}`);
      $('.nameDisplay').text(`${data.username}`);
    })
})

$('#check_in').click(() => {
  let cookieID = $('#check_in').data('usercookie');
  $.post(`/index/user-updatedata/${cookieID}`, {
  },
    (data) => {
      socket.emit("PlayArea-login", data);
    });
});

socket.on('chaCard',(data) => {
  $(".PlayArea").fadeIn();
  $('#play').empty();
  let USERMAP = data.userArray;
  USERMAP.forEach((e) => {
    $('#play').append(`
    <div class="item-CharacterCard card">
    <img src="./images/cha/${e.userPicUrl}" class="card-img-top" class="card-body" class="card-title">
    <p> ${e.userName}</p>
    </div>
    `)
  });
})

//roomへjoinした
socket.on("Status-login", (msg) => {
  $('#login_now').text(`${msg.roomAconnect_Now}/7`);
})