'use strict';
import $ from "jquery";
const global = Function('return this;')();
global.jQuery = $;
import bootstrap from 'bootstrap';
import io from 'socket.io-client';
const Config = require('../config');


const socket = io(`${Config.ipAddress}`);

socket.on('start data', (startObj) => {
  const HexNum = require('crypto').randomBytes(8).toString('hex');
  const marginTop_Array = ["10","50","90","130","170","210","250","290","330"];
  const marginTop_random = Math.floor(Math.random() * marginTop_Array.length);
  const marginTop = marginTop_Array[marginTop_random];
  $('.nico-comentArea').append(
    `<div class="move-text" id="C-${HexNum}" style="top:${marginTop}px;">${startObj.coment}</div>`
    );
  $(`#C-${HexNum}`).on('animationend', function() {
    $(`#C-${HexNum}`).remove();
});
});



$("#Button_send-coment").click(() => {
  socket.emit("chat", $("#input-coment").val());
})


socket.on("chat",(msg) => {
  const HexNum = require('crypto').randomBytes(8).toString('hex');
  const marginTop_Array = ["10","50","90","130","170","210","250","290","330"];
  const marginTop_random = Math.floor(Math.random() * marginTop_Array.length);
  const marginTop = marginTop_Array[marginTop_random];
  $('.nico-comentArea').append(`<div class="move-text" id="C-${HexNum}" style="top:${marginTop}px;">${msg}</div>`);
  $(`#C-${HexNum}`).on('animationend', function() {
    $(`#C-${HexNum}`).remove();
});
});



////////$document.getElementById ////////
const username_change_button = $('#Button_change_userName');
const userName_area = $('.userName');
const error_area = $('#error-div');


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


//名前変更ボタンクリック時の挙動//
username_change_button.click(() => {
  const cookieID = username_change_button.data('user-id');
  const char_Filename = Math.floor(Math.random() * Characterimage_Array.length);

  error_area.text("");
  //クッキーの値が取れなかった時
  if (!cookieID) {
    error_area.text("※ページをリロードしてください。");
    return;
  }

  //インプットエリアの値の取得
  const input_Value = $('#input-name').val();

  //もし文字数が0以下だった場合
  if (input_Value.length <= 0) {
    return;
  } else if (input_Value.length > 10) {　//文字数が11以上
    error_area.text("※ニックネームは１０文字までです。")
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
      userName_area.text(`${data.username}`)
    })
})
const username = $('#main').attr('data-username');

