'use strict';
import $ from "jquery";
const global = Function('return this;')();
global.jQuery = $;
import bootstrap from 'bootstrap';


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

